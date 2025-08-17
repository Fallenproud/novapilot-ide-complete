
import { VirtualFileSystem } from '../virtualFileSystem';

export interface LovableModule {
  id: string;
  exports: any;
  loaded: boolean;
  dependencies: string[];
}

export interface RuntimeConfig {
  enableHMR: boolean;
  enableTypeChecking: boolean;
  enableSourceMaps: boolean;
  sandboxed: boolean;
}

export class LovableRuntime {
  private modules: Map<string, LovableModule> = new Map();
  private moduleCache: Map<string, any> = new Map();
  private dependencies: Map<string, string[]> = new Map();
  private config: RuntimeConfig;
  private vfs: VirtualFileSystem;
  private hmrCallbacks: Map<string, Function[]> = new Map();

  constructor(vfs: VirtualFileSystem, config: Partial<RuntimeConfig> = {}) {
    this.vfs = vfs;
    this.config = {
      enableHMR: true,
      enableTypeChecking: true,
      enableSourceMaps: true,
      sandboxed: true,
      ...config
    };
    
    this.setupGlobalEnvironment();
  }

  private setupGlobalEnvironment() {
    // Create sandboxed global environment
    if (this.config.sandboxed) {
      this.createSandbox();
    }
  }

  private createSandbox() {
    // Sandboxed execution environment
    const sandbox = {
      console: {
        log: (...args: any[]) => this.emitConsoleLog('log', args),
        error: (...args: any[]) => this.emitConsoleLog('error', args),
        warn: (...args: any[]) => this.emitConsoleLog('warn', args),
        info: (...args: any[]) => this.emitConsoleLog('info', args)
      },
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      fetch: window.fetch.bind(window),
      Promise,
      Object,
      Array,
      JSON,
      Date,
      Math,
      RegExp
    };

    return sandbox;
  }

  private emitConsoleLog(level: string, args: any[]) {
    // Emit console events for preview integration
    window.dispatchEvent(new CustomEvent('lovable:console', {
      detail: { level, args, timestamp: Date.now() }
    }));
  }

  async executeModule(moduleId: string): Promise<any> {
    // Check cache first
    if (this.moduleCache.has(moduleId)) {
      return this.moduleCache.get(moduleId);
    }

    const file = this.vfs.getFile(moduleId);
    if (!file) {
      throw new Error(`Module not found: ${moduleId}`);
    }

    try {
      // Compile and execute module
      const compiledCode = await this.compileModule(file.content, file.language);
      const moduleExports = await this.runInSandbox(compiledCode, moduleId);
      
      // Cache the result
      this.moduleCache.set(moduleId, moduleExports);
      
      // Track dependencies for HMR
      const deps = this.vfs.getDependencies(moduleId);
      this.dependencies.set(moduleId, deps);
      
      return moduleExports;
    } catch (error) {
      console.error(`Error executing module ${moduleId}:`, error);
      throw error;
    }
  }

  private async compileModule(code: string, language: string): Promise<string> {
    switch (language) {
      case 'typescript':
      case 'tsx':
        return await this.compileTypeScript(code);
      case 'javascript':
      case 'jsx':
        return await this.compileJavaScript(code);
      default:
        return code;
    }
  }

  private async compileTypeScript(code: string): Promise<string> {
    // Use browser TypeScript compiler
    if (typeof window !== 'undefined' && (window as any).ts) {
      const ts = (window as any).ts;
      const result = ts.transpile(code, {
        target: ts.ScriptTarget.ES2018,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React,
        allowJs: true,
        esModuleInterop: true
      });
      return result;
    }
    
    // Fallback to basic JSX transformation
    return this.compileJavaScript(code);
  }

  private async compileJavaScript(code: string): Promise<string> {
    // Basic JSX transformation using regex (for now)
    let transformedCode = code;
    
    // Transform JSX elements
    transformedCode = transformedCode.replace(
      /<(\w+)([^>]*)>(.*?)<\/\1>/gs,
      (match, tag, props, children) => {
        const propsStr = props.trim() ? `, {${props}}` : ', null';
        return `React.createElement('${tag}'${propsStr}, ${children})`;
      }
    );
    
    // Transform self-closing JSX
    transformedCode = transformedCode.replace(
      /<(\w+)([^>]*?)\/>/g,
      (match, tag, props) => {
        const propsStr = props.trim() ? `, {${props}}` : '';
        return `React.createElement('${tag}'${propsStr})`;
      }
    );
    
    return transformedCode;
  }

  private async runInSandbox(code: string, moduleId: string): Promise<any> {
    const sandbox = this.createSandbox();
    const moduleExports = {};
    
    // Create module wrapper
    const wrappedCode = `
      (function(module, exports, require, console) {
        ${code}
        return module.exports || exports;
      })
    `;
    
    try {
      const moduleFunction = eval(wrappedCode);
      const result = moduleFunction(
        { exports: moduleExports },
        moduleExports,
        (id: string) => this.requireModule(id, moduleId),
        sandbox.console
      );
      
      return result || moduleExports;
    } catch (error) {
      throw new Error(`Runtime error in ${moduleId}: ${error.message}`);
    }
  }

  private requireModule(id: string, fromModule: string): any {
    // Resolve relative imports
    const resolvedId = this.resolveModuleId(id, fromModule);
    return this.executeModule(resolvedId);
  }

  private resolveModuleId(id: string, fromModule: string): string {
    if (id.startsWith('./') || id.startsWith('../')) {
      // Relative import
      const fromDir = fromModule.split('/').slice(0, -1).join('/');
      const resolved = this.resolvePath(fromDir, id);
      return resolved;
    }
    
    // Absolute or npm module
    return id;
  }

  private resolvePath(currentDir: string, relativePath: string): string {
    const parts = relativePath.split('/');
    const resolvedParts = currentDir.split('/');

    parts.forEach(part => {
      if (part === '..') {
        resolvedParts.pop();
      } else if (part !== '.') {
        resolvedParts.push(part);
      }
    });

    return resolvedParts.join('/');
  }

  // Hot Module Replacement
  enableHMR(moduleId: string, callback: Function) {
    if (!this.hmrCallbacks.has(moduleId)) {
      this.hmrCallbacks.set(moduleId, []);
    }
    this.hmrCallbacks.get(moduleId)!.push(callback);
  }

  async hotReload(moduleId: string) {
    if (!this.config.enableHMR) return;
    
    // Clear cache
    this.moduleCache.delete(moduleId);
    
    // Re-execute module
    const newExports = await this.executeModule(moduleId);
    
    // Trigger HMR callbacks
    const callbacks = this.hmrCallbacks.get(moduleId) || [];
    callbacks.forEach(callback => callback(newExports));
    
    // Update dependent modules
    this.updateDependents(moduleId);
  }

  private updateDependents(moduleId: string) {
    for (const [depModuleId, deps] of this.dependencies.entries()) {
      if (deps.includes(moduleId)) {
        this.hotReload(depModuleId);
      }
    }
  }

  dispose() {
    this.modules.clear();
    this.moduleCache.clear();
    this.dependencies.clear();
    this.hmrCallbacks.clear();
  }
}
