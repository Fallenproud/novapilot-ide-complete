
export interface CompilationResult {
  code: string;
  sourceMap?: string;
  errors: CompilationError[];
  warnings: CompilationWarning[];
}

export interface CompilationError {
  message: string;
  line: number;
  column: number;
  file: string;
}

export interface CompilationWarning {
  message: string;
  line: number;
  column: number;
  file: string;
}

export class LovableCompiler {
  private tsWorker: Worker | null = null;
  private babelWorker: Worker | null = null;

  constructor() {
    this.initializeWorkers();
  }

  private initializeWorkers() {
    // Initialize web workers for compilation (if available)
    if (typeof Worker !== 'undefined') {
      try {
        // TypeScript compiler worker would be initialized here
        // For now, we'll use inline compilation
      } catch (error) {
        console.warn('Web workers not available, using inline compilation');
      }
    }
  }

  async compileTypeScript(code: string, filename: string): Promise<CompilationResult> {
    const errors: CompilationError[] = [];
    const warnings: CompilationWarning[] = [];

    try {
      // Load TypeScript if available
      if (typeof window !== 'undefined' && (window as any).ts) {
        const ts = (window as any).ts;
        
        const result = ts.transpile(code, {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.ES2020,
          jsx: ts.JsxEmit.ReactJSX,
          allowJs: true,
          esModuleInterop: true,
          skipLibCheck: true,
          allowSyntheticDefaultImports: true,
          strict: false, // Relaxed for playground
          noEmitOnError: false
        });

        return {
          code: result,
          errors,
          warnings
        };
      }
      
      // Fallback to basic transformation
      const transformedCode = await this.basicTypeScriptTransform(code);
      return {
        code: transformedCode,
        errors,
        warnings
      };
      
    } catch (error) {
      errors.push({
        message: error instanceof Error ? error.message : 'Compilation failed',
        line: 1,
        column: 1,
        file: filename
      });
      
      return {
        code: '',
        errors,
        warnings
      };
    }
  }

  async compileJavaScript(code: string, filename: string): Promise<CompilationResult> {
    const errors: CompilationError[] = [];
    const warnings: CompilationWarning[] = [];

    try {
      // Transform JSX and modern JS features
      const transformedCode = await this.transformJSX(code);
      
      return {
        code: transformedCode,
        errors,
        warnings
      };
    } catch (error) {
      errors.push({
        message: error instanceof Error ? error.message : 'Compilation failed',
        line: 1,
        column: 1,
        file: filename
      });
      
      return {
        code: '',
        errors,
        warnings
      };
    }
  }

  async compileCSS(code: string, filename: string): Promise<CompilationResult> {
    const errors: CompilationError[] = [];
    const warnings: CompilationWarning[] = [];

    try {
      // For now, return CSS as-is
      // In the future, we could add SCSS/Less compilation here
      return {
        code,
        errors,
        warnings
      };
    } catch (error) {
      errors.push({
        message: error instanceof Error ? error.message : 'CSS compilation failed',
        line: 1,
        column: 1,
        file: filename
      });
      
      return {
        code: '',
        errors,
        warnings
      };
    }
  }

  private async basicTypeScriptTransform(code: string): Promise<string> {
    // Remove TypeScript-specific syntax
    let transformed = code;
    
    // Remove type annotations
    transformed = transformed.replace(/:\s*[A-Za-z][A-Za-z0-9<>[\]|&,\s]*(?=[=,);])/g, '');
    
    // Remove interface declarations
    transformed = transformed.replace(/interface\s+\w+\s*{[^}]*}/g, '');
    
    // Remove type imports
    transformed = transformed.replace(/import\s+type\s+{[^}]*}\s+from\s+['"][^'"]*['"];?/g, '');
    
    // Transform JSX
    transformed = await this.transformJSX(transformed);
    
    return transformed;
  }

  private async transformJSX(code: string): Promise<string> {
    let transformed = code;
    
    // Handle React imports
    if (!transformed.includes('import React') && transformed.includes('<')) {
      transformed = `import React from 'react';\n${transformed}`;
    }
    
    // Transform JSX elements - more sophisticated regex
    transformed = transformed.replace(
      /<(\w+)(\s+[^>]*)?>([\s\S]*?)<\/\1>/g,
      (match, tag, props, children) => {
        const propsObj = this.parseJSXProps(props || '');
        const childrenCode = this.transformJSXChildren(children);
        return `React.createElement('${tag}', ${propsObj}, ${childrenCode})`;
      }
    );
    
    // Transform self-closing JSX
    transformed = transformed.replace(
      /<(\w+)(\s+[^>]*?)?\s*\/>/g,
      (match, tag, props) => {
        const propsObj = this.parseJSXProps(props || '');
        return `React.createElement('${tag}', ${propsObj})`;
      }
    );
    
    return transformed;
  }

  private parseJSXProps(propsString: string): string {
    if (!propsString.trim()) return 'null';
    
    // Simple prop parsing - could be enhanced
    const props = propsString.trim();
    if (props.startsWith('{') && props.endsWith('}')) {
      return props;
    }
    
    // Parse individual props
    const propPairs = props.match(/(\w+)(?:=(?:"([^"]*)"|{([^}]*)}|\w+))?/g) || [];
    const propObj: Record<string, string> = {};
    
    propPairs.forEach(prop => {
      const [, name, stringVal, jsVal] = prop.match(/(\w+)(?:="([^"]*)"|={([^}]*)})?/) || [];
      if (name) {
        if (stringVal !== undefined) {
          propObj[name] = `"${stringVal}"`;
        } else if (jsVal !== undefined) {
          propObj[name] = jsVal;
        } else {
          propObj[name] = 'true';
        }
      }
    });
    
    const propEntries = Object.entries(propObj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    return `{${propEntries}}`;
  }

  private transformJSXChildren(children: string): string {
    if (!children.trim()) return '';
    
    // Split by JSX elements and text
    const parts = children.split(/(<[^>]*>.*?<\/[^>]*>|<[^>]*\/>)/);
    const transformedParts = parts
      .filter(part => part.trim())
      .map(part => {
        if (part.includes('<')) {
          return this.transformJSX(part);
        } else {
          return `"${part.trim()}"`;
        }
      });
    
    return transformedParts.join(', ');
  }

  dispose() {
    if (this.tsWorker) {
      this.tsWorker.terminate();
    }
    if (this.babelWorker) {
      this.babelWorker.terminate();
    }
  }
}
