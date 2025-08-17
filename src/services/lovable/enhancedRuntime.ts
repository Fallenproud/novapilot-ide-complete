import { VirtualFileSystem } from '../virtualFileSystem';
import { HotModuleReplacementEngine, HMRAcceptCallback, HMRDisposeCallback } from './hmr';
import { LovableDevTools } from './devtools';
import { VirtualPackageRegistry } from './packageRegistry';
import { LovableCompiler } from './compiler';

export interface EnhancedRuntimeConfig {
  enableHMR: boolean;
  enableDevTools: boolean;
  enablePackageRegistry: boolean;
  enableTypeChecking: boolean;
  enableSourceMaps: boolean;
  sandboxed: boolean;
}

export class EnhancedLovableRuntime {
  private vfs: VirtualFileSystem;
  private hmr: HotModuleReplacementEngine;
  private devTools: LovableDevTools;
  private packageRegistry: VirtualPackageRegistry;
  private compiler: LovableCompiler;
  private config: EnhancedRuntimeConfig;
  private moduleCache: Map<string, any> = new Map();
  private executionContext: any = null;

  constructor(vfs: VirtualFileSystem, config: Partial<EnhancedRuntimeConfig> = {}) {
    this.vfs = vfs;
    this.config = {
      enableHMR: true,
      enableDevTools: true,
      enablePackageRegistry: true,
      enableTypeChecking: true,
      enableSourceMaps: true,
      sandboxed: true,
      ...config
    };

    this.initializeSubsystems();
  }

  private initializeSubsystems() {
    // Initialize HMR
    if (this.config.enableHMR) {
      this.hmr = new HotModuleReplacementEngine();
      this.setupHMRIntegration();
    }

    // Initialize DevTools
    if (this.config.enableDevTools) {
      this.devTools = new LovableDevTools();
      this.devTools.startCapture();
    }

    // Initialize Package Registry
    if (this.config.enablePackageRegistry) {
      this.packageRegistry = new VirtualPackageRegistry();
    }

    // Initialize Compiler
    this.compiler = new LovableCompiler();

    // Setup execution context
    this.setupExecutionContext();
  }

  private setupExecutionContext() {
    this.executionContext = {
      // Global objects
      console: this.createEnhancedConsole(),
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
      RegExp,
      
      // React globals
      React: (window as any).React,
      ReactDOM: (window as any).ReactDOM,
      
      // HMR API
      ...(this.config.enableHMR && {
        module: {
          hot: {
            accept: (callback?: HMRAcceptCallback) => this.hmr.accept('current', callback),
            dispose: (callback: HMRDisposeCallback) => this.hmr.dispose('current', callback),
            invalidate: () => this.hmr.invalidate('current')
          }
        }
      }),
      
      // Package resolver
      require: (packageName: string) => this.resolvePackage(packageName),
      import: (packageName: string) => this.resolvePackage(packageName)
    };
  }

  private createEnhancedConsole() {
    const enhancedConsole = {
      log: (...args: any[]) => {
        console.log(...args);
        if (this.config.enableDevTools) {
          // DevTools will capture this automatically
        }
      },
      error: (...args: any[]) => {
        console.error(...args);
        // Emit error event for better error handling
        window.dispatchEvent(new CustomEvent('runtime:error', {
          detail: { args, timestamp: Date.now() }
        }));
      },
      warn: (...args: any[]) => {
        console.warn(...args);
      },
      info: (...args: any[]) => {
        console.info(...args);
      },
      debug: (...args: any[]) => {
        console.debug(...args);
      }
    };

    return enhancedConsole;
  }

  private setupHMRIntegration() {
    // Listen for file changes
    window.addEventListener('vfs:file-changed', ((event: CustomEvent) => {
      const { filePath, content } = event.detail;
      this.handleFileChange(filePath, content);
    }) as EventListener);
  }

  private async handleFileChange(filePath: string, content: string) {
    if (!this.config.enableHMR) return;

    try {
      // Update VFS
      this.vfs.updateFile(filePath, content);
      
      // Clear module cache
      this.moduleCache.delete(filePath);
      
      // Recompile
      const compilationResult = await this.compiler.compileTypeScript(content, filePath);
      
      if (compilationResult.errors.length === 0) {
        // Trigger HMR update
        await this.hmr.updateModule({
          type: 'update',
          moduleId: filePath,
          code: compilationResult.code,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('HMR update failed:', error);
    }
  }

  private async resolvePackage(packageName: string): Promise<any> {
    if (!this.config.enablePackageRegistry) {
      throw new Error('Package registry disabled');
    }

    try {
      return await this.packageRegistry.resolvePackage(packageName);
    } catch (error) {
      console.error(`Failed to resolve package: ${packageName}`, error);
      throw error;
    }
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
      // Compile the module
      let compilationResult;
      
      if (file.language === 'typescript' || file.language === 'tsx') {
        compilationResult = await this.compiler.compileTypeScript(file.content, file.path);
      } else if (file.language === 'javascript' || file.language === 'jsx') {
        compilationResult = await this.compiler.compileJavaScript(file.content, file.path);
      } else {
        throw new Error(`Unsupported file type: ${file.language}`);
      }

      if (compilationResult.errors.length > 0) {
        throw new Error(`Compilation errors: ${compilationResult.errors.map(e => e.message).join(', ')}`);
      }

      // Execute the compiled code
      const moduleExports = await this.executeInSandbox(
        compilationResult.code,
        moduleId
      );

      // Cache the result
      this.moduleCache.set(moduleId, moduleExports);
      
      // Update HMR dependency graph
      if (this.config.enableHMR) {
        const dependencies = this.vfs.getDependencies(moduleId);
        this.hmr.updateDependencyGraph(moduleId, dependencies);
      }
      
      return moduleExports;
    } catch (error) {
      console.error(`Error executing module ${moduleId}:`, error);
      throw error;
    }
  }

  private async executeInSandbox(code: string, moduleId: string): Promise<any> {
    const moduleExports = {};
    const moduleObject = {
      exports: moduleExports,
      id: moduleId,
      filename: moduleId,
      loaded: false
    };

    // Create sandboxed function
    const wrappedCode = `
      (function(module, exports, require, console, __dirname, __filename) {
        ${code}
        return module.exports;
      })
    `;

    try {
      const moduleFunction = eval(wrappedCode);
      const result = moduleFunction(
        moduleObject,
        moduleExports,
        (id: string) => this.resolvePackage(id),
        this.executionContext.console,
        '/', // __dirname
        moduleId // __filename
      );

      moduleObject.loaded = true;
      return result || moduleExports;
    } catch (error) {
      throw new Error(`Runtime error in ${moduleId}: ${error.message}`);
    }
  }

  // Public API methods
  getDevTools(): LovableDevTools | undefined {
    return this.config.enableDevTools ? this.devTools : undefined;
  }

  getPackageRegistry(): VirtualPackageRegistry | undefined {
    return this.config.enablePackageRegistry ? this.packageRegistry : undefined;
  }

  clearCache() {
    this.moduleCache.clear();
  }

  async refresh() {
    this.clearCache();
    // Re-execute all modules
    const allFiles = this.vfs.getAllFiles();
    for (const file of allFiles) {
      if (file.language !== 'css') {
        await this.executeModule(file.path);
      }
    }
  }

  dispose() {
    if (this.hmr) {
      this.hmr.dispose();
    }
    
    if (this.devTools) {
      this.devTools.dispose();
    }
    
    if (this.packageRegistry) {
      this.packageRegistry.dispose();
    }
    
    if (this.compiler) {
      this.compiler.dispose();
    }
    
    this.moduleCache.clear();
  }
}
