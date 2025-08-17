
import { LovableLanguageService, CompletionItem, Diagnostic, HoverInfo } from './languageService';

export interface CodeAction {
  title: string;
  kind: string;
  edit?: {
    changes: {
      [uri: string]: TextEdit[];
    };
  };
}

export interface TextEdit {
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  newText: string;
}

export interface RenameEdit {
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  newText: string;
}

export interface SymbolInformation {
  name: string;
  kind: SymbolKind;
  location: {
    uri: string;
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  };
}

export enum SymbolKind {
  File = 1,
  Module = 2,
  Namespace = 3,
  Package = 4,
  Class = 5,
  Method = 6,
  Property = 7,
  Field = 8,
  Constructor = 9,
  Enum = 10,
  Interface = 11,
  Function = 12,
  Variable = 13,
  Constant = 14,
  String = 15,
  Number = 16,
  Boolean = 17,
  Array = 18,
  Object = 19,
  Key = 20,
  Null = 21,
  EnumMember = 22,
  Struct = 23,
  Event = 24,
  Operator = 25,
  TypeParameter = 26
}

export class CodeIntelligenceEngine {
  private languageService: LovableLanguageService;
  private fileContents: Map<string, string> = new Map();
  private symbols: Map<string, SymbolInformation[]> = new Map();

  constructor() {
    this.languageService = new LovableLanguageService();
  }

  updateFile(filePath: string, content: string) {
    this.fileContents.set(filePath, content);
    this.languageService.clearCache(filePath);
    this.updateSymbols(filePath, content);
  }

  private updateSymbols(filePath: string, content: string) {
    const symbols: SymbolInformation[] = [];
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      // Find function declarations
      const functionMatch = line.match(/(?:function|const|let|var)\s+(\w+)\s*(?:=\s*(?:function|\([^)]*\)\s*=>)|\()/);
      if (functionMatch) {
        symbols.push({
          name: functionMatch[1],
          kind: line.includes('function') || line.includes('=>') ? SymbolKind.Function : SymbolKind.Variable,
          location: {
            uri: filePath,
            range: {
              start: { line: lineIndex, character: functionMatch.index! },
              end: { line: lineIndex, character: functionMatch.index! + functionMatch[0].length }
            }
          }
        });
      }

      // Find class declarations
      const classMatch = line.match(/class\s+(\w+)/);
      if (classMatch) {
        symbols.push({
          name: classMatch[1],
          kind: SymbolKind.Class,
          location: {
            uri: filePath,
            range: {
              start: { line: lineIndex, character: classMatch.index! },
              end: { line: lineIndex, character: classMatch.index! + classMatch[0].length }
            }
          }
        });
      }

      // Find interface declarations
      const interfaceMatch = line.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        symbols.push({
          name: interfaceMatch[1],
          kind: SymbolKind.Interface,
          location: {
            uri: filePath,
            range: {
              start: { line: lineIndex, character: interfaceMatch.index! },
              end: { line: lineIndex, character: interfaceMatch.index! + interfaceMatch[0].length }
            }
          }
        });
      }

      // Find type declarations
      const typeMatch = line.match(/type\s+(\w+)/);
      if (typeMatch) {
        symbols.push({
          name: typeMatch[1],
          kind: SymbolKind.TypeParameter,
          location: {
            uri: filePath,
            range: {
              start: { line: lineIndex, character: typeMatch.index! },
              end: { line: lineIndex, character: typeMatch.index! + typeMatch[0].length }
            }
          }
        });
      }
    });

    this.symbols.set(filePath, symbols);
  }

  async getCompletions(
    filePath: string,
    position: { line: number; character: number }
  ): Promise<CompletionItem[]> {
    const content = this.fileContents.get(filePath);
    if (!content) return [];

    return this.languageService.getCompletions(content, position, filePath);
  }

  async getDiagnostics(filePath: string): Promise<Diagnostic[]> {
    const content = this.fileContents.get(filePath);
    if (!content) return [];

    return this.languageService.getDiagnostics(content, filePath);
  }

  async getHoverInfo(
    filePath: string,
    position: { line: number; character: number }
  ): Promise<HoverInfo | null> {
    const content = this.fileContents.get(filePath);
    if (!content) return null;

    return this.languageService.getHoverInfo(content, position, filePath);
  }

  async getCodeActions(
    filePath: string,
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    },
    diagnostics: Diagnostic[]
  ): Promise<CodeAction[]> {
    const actions: CodeAction[] = [];
    const content = this.fileContents.get(filePath);
    if (!content) return actions;

    // Add quick fixes for common issues
    diagnostics.forEach(diagnostic => {
      if (diagnostic.code === 'no-console') {
        actions.push({
          title: 'Remove console.log',
          kind: 'quickfix',
          edit: {
            changes: {
              [filePath]: [{
                range: diagnostic.range,
                newText: ''
              }]
            }
          }
        });
      }

      if (diagnostic.code === 'unused-variable') {
        actions.push({
          title: 'Remove unused variable',
          kind: 'quickfix',
          edit: {
            changes: {
              [filePath]: [{
                range: {
                  start: { line: diagnostic.range.start.line, character: 0 },
                  end: { line: diagnostic.range.start.line + 1, character: 0 }
                },
                newText: ''
              }]
            }
          }
        });
      }
    });

    // Add refactoring actions
    const lines = content.split('\n');
    const currentLine = lines[range.start.line] || '';
    
    // Extract function refactoring
    if (currentLine.includes('function') || currentLine.includes('=>')) {
      actions.push({
        title: 'Extract to new file',
        kind: 'refactor.extract',
        edit: {
          changes: {
            [filePath]: [] // Would implement the actual extraction logic
          }
        }
      });
    }

    return actions;
  }

  async findReferences(
    filePath: string,
    position: { line: number; character: number }
  ): Promise<SymbolInformation[]> {
    const content = this.fileContents.get(filePath);
    if (!content) return [];

    const lines = content.split('\n');
    const currentLine = lines[position.line] || '';
    
    // Extract word at cursor
    const wordMatch = currentLine.match(/\w+/g);
    if (!wordMatch) return [];

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

    if (!wordAtCursor) return [];

    const references: SymbolInformation[] = [];

    // Search across all files
    for (const [searchFilePath, searchContent] of this.fileContents.entries()) {
      const searchLines = searchContent.split('\n');
      searchLines.forEach((line, lineIndex) => {
        const regex = new RegExp(`\\b${wordAtCursor}\\b`, 'g');
        let match;
        while ((match = regex.exec(line)) !== null) {
          references.push({
            name: wordAtCursor,
            kind: SymbolKind.Variable, // Default kind
            location: {
              uri: searchFilePath,
              range: {
                start: { line: lineIndex, character: match.index },
                end: { line: lineIndex, character: match.index + wordAtCursor.length }
              }
            }
          });
        }
      });
    }

    return references;
  }

  async renameSymbol(
    filePath: string,
    position: { line: number; character: number },
    newName: string
  ): Promise<{ [uri: string]: RenameEdit[] }> {
    const references = await this.findReferences(filePath, position);
    const edits: { [uri: string]: RenameEdit[] } = {};

    references.forEach(ref => {
      if (!edits[ref.location.uri]) {
        edits[ref.location.uri] = [];
      }
      edits[ref.location.uri].push({
        range: ref.location.range,
        newText: newName
      });
    });

    return edits;
  }

  getDocumentSymbols(filePath: string): SymbolInformation[] {
    return this.symbols.get(filePath) || [];
  }

  getWorkspaceSymbols(query?: string): SymbolInformation[] {
    const allSymbols: SymbolInformation[] = [];
    
    for (const symbols of this.symbols.values()) {
      allSymbols.push(...symbols);
    }

    if (query) {
      return allSymbols.filter(symbol => 
        symbol.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return allSymbols;
  }

  dispose() {
    this.languageService.dispose();
    this.fileContents.clear();
    this.symbols.clear();
  }
}
