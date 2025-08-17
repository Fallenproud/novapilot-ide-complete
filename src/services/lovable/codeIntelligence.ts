import { MonacoLanguageService } from './languageService';
import type { Diagnostic, CompletionItem, HoverInfo } from './languageService';

export { type Diagnostic, type CompletionItem, type HoverInfo };

export interface SymbolInfo {
  name: string;
  kind: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
  documentation?: string;
}

export interface ReferenceInfo {
  file: string;
  line: number;
  column: number;
  context: string;
}

export interface QuickFixAction {
  title: string;
  kind: string;
  edit: {
    file: string;
    range: {
      startLine: number;
      startColumn: number;
      endLine: number;
      endColumn: number;
    };
    newText: string;
  };
}

export class CodeIntelligenceEngine {
  private languageService: MonacoLanguageService;
  private fileContents: Map<string, string> = new Map();
  private symbolCache: Map<string, SymbolInfo[]> = new Map();
  private diagnosticsCache: Map<string, Diagnostic[]> = new Map();

  constructor() {
    this.languageService = new MonacoLanguageService();
  }

  updateFile(filePath: string, content: string) {
    this.fileContents.set(filePath, content);
    this.languageService.updateFile(filePath, content);
    
    // Clear caches for this file
    this.symbolCache.delete(filePath);
    this.diagnosticsCache.delete(filePath);
    
    // Emit file change event
    window.dispatchEvent(new CustomEvent('code-intelligence:file-updated', {
      detail: { filePath, content }
    }));
  }

  async getCompletions(filePath: string, line: number, column: number): Promise<CompletionItem[]> {
    return this.languageService.getCompletions(filePath, line, column);
  }

  async getHoverInfo(filePath: string, line: number, column: number): Promise<HoverInfo | null> {
    return this.languageService.getHoverInfo(filePath, line, column);
  }

  async getDiagnostics(filePath: string): Promise<Diagnostic[]> {
    if (this.diagnosticsCache.has(filePath)) {
      return this.diagnosticsCache.get(filePath)!;
    }

    const diagnostics = await this.languageService.getDiagnostics(filePath);
    this.diagnosticsCache.set(filePath, diagnostics);
    return diagnostics;
  }

  async findSymbols(query: string): Promise<SymbolInfo[]> {
    const allSymbols: SymbolInfo[] = [];
    
    for (const [filePath, content] of this.fileContents.entries()) {
      if (!this.symbolCache.has(filePath)) {
        const symbols = await this.extractSymbols(filePath, content);
        this.symbolCache.set(filePath, symbols);
      }
      
      const symbols = this.symbolCache.get(filePath)!;
      const matchingSymbols = symbols.filter(symbol => 
        symbol.name.toLowerCase().includes(query.toLowerCase())
      );
      
      allSymbols.push(...matchingSymbols);
    }
    
    return allSymbols.slice(0, 50); // Limit results
  }

  async findReferences(filePath: string, line: number, column: number): Promise<ReferenceInfo[]> {
    const references: ReferenceInfo[] = [];
    const content = this.fileContents.get(filePath);
    
    if (!content) return references;
    
    // Simple reference finding - can be enhanced with AST parsing
    const lines = content.split('\n');
    const currentLine = lines[line - 1];
    
    if (!currentLine) return references;
    
    // Extract word at position
    const wordMatch = currentLine.slice(0, column).match(/\w+$/);
    if (!wordMatch) return references;
    
    const word = wordMatch[0];
    
    // Search for references across all files
    for (const [searchFilePath, searchContent] of this.fileContents.entries()) {
      const searchLines = searchContent.split('\n');
      
      searchLines.forEach((searchLine, lineIndex) => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        let match;
        
        while ((match = regex.exec(searchLine)) !== null) {
          references.push({
            file: searchFilePath,
            line: lineIndex + 1,
            column: match.index + 1,
            context: searchLine.trim()
          });
        }
      });
    }
    
    return references;
  }

  async renameSymbol(filePath: string, line: number, column: number, newName: string): Promise<{file: string, edits: Array<{range: any, newText: string}>}[]> {
    const references = await this.findReferences(filePath, line, column);
    const edits: {file: string, edits: Array<{range: any, newText: string}>}[] = [];
    
    // Group references by file
    const fileGroups = new Map<string, ReferenceInfo[]>();
    
    references.forEach(ref => {
      if (!fileGroups.has(ref.file)) {
        fileGroups.set(ref.file, []);
      }
      fileGroups.get(ref.file)!.push(ref);
    });
    
    // Create edits for each file
    fileGroups.forEach((refs, file) => {
      const fileEdits = refs.map(ref => ({
        range: {
          startLine: ref.line,
          startColumn: ref.column,
          endLine: ref.line,
          endColumn: ref.column + newName.length
        },
        newText: newName
      }));
      
      edits.push({ file, edits: fileEdits });
    });
    
    return edits;
  }

  async getQuickFixes(filePath: string, line: number, column: number): Promise<QuickFixAction[]> {
    const diagnostics = await this.getDiagnostics(filePath);
    const fixes: QuickFixAction[] = [];
    
    // Find diagnostics at the given position
    const relevantDiagnostics = diagnostics.filter(diagnostic => 
      diagnostic.line >= line - 1 && diagnostic.line <= line + 1
    );
    
    relevantDiagnostics.forEach(diagnostic => {
      // Generate quick fixes based on diagnostic type
      if (diagnostic.message.includes('not found') || diagnostic.message.includes('undefined')) {
        fixes.push({
          title: `Add import for missing symbol`,
          kind: 'quickfix',
          edit: {
            file: filePath,
            range: {
              startLine: 1,
              startColumn: 1,
              endLine: 1,
              endColumn: 1
            },
            newText: `// TODO: Add import\n`
          }
        });
      }
      
      if (diagnostic.message.includes('unused')) {
        fixes.push({
          title: `Remove unused declaration`,
          kind: 'quickfix',
          edit: {
            file: filePath,
            range: {
              startLine: diagnostic.line,
              startColumn: 1,
              endLine: diagnostic.line + 1,
              endColumn: 1
            },
            newText: ''
          }
        });
      }
    });
    
    return fixes;
  }

  private async extractSymbols(filePath: string, content: string): Promise<SymbolInfo[]> {
    const symbols: SymbolInfo[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Extract function declarations
      const functionMatch = line.match(/(?:function|const|let|var)\s+(\w+)/);
      if (functionMatch) {
        symbols.push({
          name: functionMatch[1],
          kind: 'function',
          location: {
            file: filePath,
            line: index + 1,
            column: functionMatch.index! + 1
          }
        });
      }
      
      // Extract class declarations
      const classMatch = line.match(/class\s+(\w+)/);
      if (classMatch) {
        symbols.push({
          name: classMatch[1],
          kind: 'class',
          location: {
            file: filePath,
            line: index + 1,
            column: classMatch.index! + 1
          }
        });
      }
      
      // Extract interface declarations
      const interfaceMatch = line.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        symbols.push({
          name: interfaceMatch[1],
          kind: 'interface',
          location: {
            file: filePath,
            line: index + 1,
            column: interfaceMatch.index! + 1
          }
        });
      }
    });
    
    return symbols;
  }

  dispose() {
    this.languageService.dispose();
    this.fileContents.clear();
    this.symbolCache.clear();
    this.diagnosticsCache.clear();
  }
}
