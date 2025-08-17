
export interface CompletionItem {
  label: string;
  kind: CompletionItemKind;
  detail?: string;
  documentation?: string;
  insertText?: string;
  sortText?: string;
}

export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18
}

export interface Diagnostic {
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  severity: DiagnosticSeverity;
  message: string;
  source?: string;
  code?: string | number;
}

export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4
}

export interface HoverInfo {
  contents: string[];
  range?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

export class LovableLanguageService {
  private typeDefinitions: Map<string, any> = new Map();
  private completionCache: Map<string, CompletionItem[]> = new Map();
  private diagnosticsCache: Map<string, Diagnostic[]> = new Map();

  constructor() {
    this.initializeBuiltinTypes();
  }

  private initializeBuiltinTypes() {
    // React built-in types
    this.typeDefinitions.set('React', {
      Component: {
        kind: CompletionItemKind.Class,
        detail: 'class Component<P = {}, S = {}, SS = any>',
        documentation: 'Base class for React components when defined as classes.'
      },
      useState: {
        kind: CompletionItemKind.Function,
        detail: 'function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]',
        documentation: 'Returns a stateful value, and a function to update it.'
      },
      useEffect: {
        kind: CompletionItemKind.Function,
        detail: 'function useEffect(effect: EffectCallback, deps?: DependencyList): void',
        documentation: 'Accepts a function that contains imperative, possibly effectful code.'
      },
      useContext: {
        kind: CompletionItemKind.Function,
        detail: 'function useContext<T>(context: Context<T>): T',
        documentation: 'Accepts a context object and returns the current context value.'
      },
      useRef: {
        kind: CompletionItemKind.Function,
        detail: 'function useRef<T>(initialValue: T): MutableRefObject<T>',
        documentation: 'Returns a mutable ref object whose .current property is initialized to the passed argument.'
      },
      createElement: {
        kind: CompletionItemKind.Function,
        detail: 'function createElement<P extends {}>(type: FunctionComponent<P> | ComponentClass<P> | string, props?: Attributes & P | null, ...children: ReactNode[]): ReactElement<P>',
        documentation: 'Create and return a new React element of the given type.'
      }
    });

    // HTML/JSX elements
    const htmlElements = [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'button', 'input', 'form', 'label', 'textarea', 'select', 'option',
      'ul', 'ol', 'li', 'nav', 'header', 'footer', 'main', 'section', 'article',
      'img', 'video', 'audio', 'canvas', 'svg', 'path', 'circle', 'rect',
      'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ];

    htmlElements.forEach(element => {
      this.typeDefinitions.set(element, {
        kind: CompletionItemKind.Value,
        detail: `<${element}>`,
        documentation: `HTML ${element} element`
      });
    });

    // JavaScript/TypeScript built-ins
    this.typeDefinitions.set('console', {
      log: {
        kind: CompletionItemKind.Method,
        detail: 'console.log(...data: any[]): void',
        documentation: 'Outputs a message to the web console.'
      },
      error: {
        kind: CompletionItemKind.Method,
        detail: 'console.error(...data: any[]): void',
        documentation: 'Outputs an error message to the web console.'
      },
      warn: {
        kind: CompletionItemKind.Method,
        detail: 'console.warn(...data: any[]): void',
        documentation: 'Outputs a warning message to the web console.'
      }
    });
  }

  async getCompletions(
    text: string,
    position: { line: number; character: number },
    filePath: string
  ): Promise<CompletionItem[]> {
    const cacheKey = `${filePath}:${position.line}:${position.character}`;
    
    if (this.completionCache.has(cacheKey)) {
      return this.completionCache.get(cacheKey)!;
    }

    const completions: CompletionItem[] = [];
    const lines = text.split('\n');
    const currentLine = lines[position.line] || '';
    const textBeforeCursor = currentLine.substring(0, position.character);

    // React hook completions
    if (textBeforeCursor.includes('use')) {
      completions.push(
        {
          label: 'useState',
          kind: CompletionItemKind.Function,
          detail: 'React Hook',
          documentation: 'Returns a stateful value, and a function to update it.',
          insertText: 'useState($1)',
          sortText: '0001'
        },
        {
          label: 'useEffect',
          kind: CompletionItemKind.Function,
          detail: 'React Hook',
          documentation: 'Accepts a function that contains imperative, possibly effectful code.',
          insertText: 'useEffect(() => {\n  $1\n}, [])',
          sortText: '0002'
        },
        {
          label: 'useContext',
          kind: CompletionItemKind.Function,
          detail: 'React Hook',
          documentation: 'Accepts a context object and returns the current context value.',
          insertText: 'useContext($1)',
          sortText: '0003'
        },
        {
          label: 'useRef',
          kind: CompletionItemKind.Function,
          detail: 'React Hook',
          documentation: 'Returns a mutable ref object.',
          insertText: 'useRef($1)',
          sortText: '0004'
        }
      );
    }

    // JSX element completions
    if (textBeforeCursor.includes('<')) {
      const htmlElements = ['div', 'span', 'button', 'input', 'form', 'p', 'h1', 'h2', 'h3'];
      htmlElements.forEach((element, index) => {
        completions.push({
          label: element,
          kind: CompletionItemKind.Value,
          detail: `<${element}>`,
          documentation: `HTML ${element} element`,
          insertText: `${element}>$1</${element}>`,
          sortText: `1${index.toString().padStart(3, '0')}`
        });
      });
    }

    // Console completions
    if (textBeforeCursor.includes('console.')) {
      completions.push(
        {
          label: 'log',
          kind: CompletionItemKind.Method,
          detail: 'console.log(...data: any[]): void',
          documentation: 'Outputs a message to the web console.',
          insertText: 'log($1)',
          sortText: '2001'
        },
        {
          label: 'error',
          kind: CompletionItemKind.Method,
          detail: 'console.error(...data: any[]): void',
          documentation: 'Outputs an error message to the web console.',
          insertText: 'error($1)',
          sortText: '2002'
        },
        {
          label: 'warn',
          kind: CompletionItemKind.Method,
          detail: 'console.warn(...data: any[]): void',
          documentation: 'Outputs a warning message to the web console.',
          insertText: 'warn($1)',
          sortText: '2003'
        }
      );
    }

    // Function/variable declarations
    const functionMatches = text.match(/(?:function|const|let|var)\s+(\w+)/g);
    if (functionMatches) {
      functionMatches.forEach((match, index) => {
        const name = match.split(/\s+/)[1];
        if (name && !completions.find(c => c.label === name)) {
          completions.push({
            label: name,
            kind: match.startsWith('function') ? CompletionItemKind.Function : CompletionItemKind.Variable,
            detail: match.startsWith('function') ? `function ${name}` : `variable ${name}`,
            documentation: `User-defined ${match.startsWith('function') ? 'function' : 'variable'}`,
            sortText: `3${index.toString().padStart(3, '0')}`
          });
        }
      });
    }

    // TypeScript/JavaScript keywords
    const keywords = [
      'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do',
      'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch',
      'finally', 'throw', 'new', 'class', 'extends', 'implements', 'interface',
      'type', 'enum', 'namespace', 'import', 'export', 'from', 'as'
    ];

    keywords.forEach((keyword, index) => {
      if (keyword.toLowerCase().includes(textBeforeCursor.toLowerCase().split(/\s+/).pop() || '')) {
        completions.push({
          label: keyword,
          kind: CompletionItemKind.Keyword,
          detail: `Keyword`,
          documentation: `JavaScript/TypeScript keyword: ${keyword}`,
          sortText: `9${index.toString().padStart(3, '0')}`
        });
      }
    });

    this.completionCache.set(cacheKey, completions);
    return completions;
  }

  async getDiagnostics(text: string, filePath: string): Promise<Diagnostic[]> {
    if (this.diagnosticsCache.has(filePath)) {
      return this.diagnosticsCache.get(filePath)!;
    }

    const diagnostics: Diagnostic[] = [];
    const lines = text.split('\n');

    // Basic syntax checking
    lines.forEach((line, lineIndex) => {
      // Check for unclosed brackets
      const openBrackets = (line.match(/[{[(]/g) || []).length;
      const closeBrackets = (line.match(/[}\])]/g) || []).length;
      
      if (openBrackets > closeBrackets) {
        diagnostics.push({
          range: {
            start: { line: lineIndex, character: line.length - 1 },
            end: { line: lineIndex, character: line.length }
          },
          severity: DiagnosticSeverity.Warning,
          message: 'Unclosed bracket detected',
          source: 'lovable-lsp'
        });
      }

      // Check for console.log statements (code quality hint)
      if (line.includes('console.log')) {
        const index = line.indexOf('console.log');
        diagnostics.push({
          range: {
            start: { line: lineIndex, character: index },
            end: { line: lineIndex, character: index + 11 }
          },
          severity: DiagnosticSeverity.Information,
          message: 'Consider removing console.log before production',
          source: 'lovable-lsp',
          code: 'no-console'
        });
      }

      // Check for unused variables (simple pattern)
      const varDeclaration = line.match(/(?:const|let|var)\s+(\w+)/);
      if (varDeclaration) {
        const varName = varDeclaration[1];
        const restOfFile = lines.slice(lineIndex + 1).join('\n');
        if (!restOfFile.includes(varName)) {
          diagnostics.push({
            range: {
              start: { line: lineIndex, character: varDeclaration.index! },
              end: { line: lineIndex, character: varDeclaration.index! + varDeclaration[0].length }
            },
            severity: DiagnosticSeverity.Hint,
            message: `'${varName}' is declared but never used`,
            source: 'lovable-lsp',
            code: 'unused-variable'
          });
        }
      }
    });

    this.diagnosticsCache.set(filePath, diagnostics);
    return diagnostics;
  }

  async getHoverInfo(
    text: string,
    position: { line: number; character: number },
    filePath: string
  ): Promise<HoverInfo | null> {
    const lines = text.split('\n');
    const currentLine = lines[position.line] || '';
    
    // Simple word extraction at cursor position
    const wordMatch = currentLine.match(/\w+/g);
    if (!wordMatch) return null;

    let wordAtCursor = '';
    let currentPos = 0;
    
    for (const word of wordMatch) {
      const wordStart = currentLine.indexOf(word, currentPos);
      const wordEnd = wordStart + word.length;
      
      if (position.character >= wordStart && position.character <= wordEnd) {
        wordAtCursor = word;
        break;
      }
      currentPos = wordEnd;
    }

    if (!wordAtCursor) return null;

    // Look up hover information
    const reactTypes = this.typeDefinitions.get('React');
    if (reactTypes && reactTypes[wordAtCursor]) {
      const info = reactTypes[wordAtCursor];
      return {
        contents: [
          `**${wordAtCursor}**`,
          info.detail || '',
          info.documentation || ''
        ].filter(Boolean)
      };
    }

    // Check for HTML elements
    const htmlElement = this.typeDefinitions.get(wordAtCursor);
    if (htmlElement) {
      return {
        contents: [
          `**${wordAtCursor}**`,
          htmlElement.detail || '',
          htmlElement.documentation || ''
        ].filter(Boolean)
      };
    }

    // Look for function definitions in the current file
    const functionMatch = text.match(new RegExp(`function\\s+${wordAtCursor}\\s*\\([^)]*\\)`, 'g'));
    if (functionMatch) {
      return {
        contents: [
          `**${wordAtCursor}**`,
          functionMatch[0],
          'User-defined function'
        ]
      };
    }

    return null;
  }

  clearCache(filePath?: string) {
    if (filePath) {
      // Clear cache for specific file
      const keysToDelete = Array.from(this.completionCache.keys()).filter(key => key.startsWith(filePath));
      keysToDelete.forEach(key => this.completionCache.delete(key));
      this.diagnosticsCache.delete(filePath);
    } else {
      // Clear all cache
      this.completionCache.clear();
      this.diagnosticsCache.clear();
    }
  }

  dispose() {
    this.completionCache.clear();
    this.diagnosticsCache.clear();
    this.typeDefinitions.clear();
  }
}
