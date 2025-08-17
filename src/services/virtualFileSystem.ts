
import { ProjectFile } from '@/stores/projectStore';

export interface VirtualFile {
  path: string;
  content: string;
  language: string;
}

export class VirtualFileSystem {
  private files: Map<string, VirtualFile> = new Map();
  private dependencies: Map<string, string[]> = new Map();

  constructor(projectFiles: ProjectFile[]) {
    this.loadFiles(projectFiles);
  }

  private loadFiles(projectFiles: ProjectFile[]) {
    this.files.clear();
    this.dependencies.clear();

    projectFiles.forEach(file => {
      const virtualFile: VirtualFile = {
        path: file.path,
        content: file.content,
        language: file.language
      };
      
      this.files.set(file.path, virtualFile);
      this.analyzeDependencies(file);
    });
  }

  private analyzeDependencies(file: ProjectFile) {
    const imports: string[] = [];
    const lines = file.content.split('\n');
    
    lines.forEach(line => {
      // Match ES6 imports from relative paths
      const importMatch = line.match(/import.*from\s+['"](\.[^'"]*)['"]/);
      if (importMatch) {
        const importPath = this.resolvePath(file.path, importMatch[1]);
        imports.push(importPath);
      }
    });
    
    this.dependencies.set(file.path, imports);
  }

  private resolvePath(currentPath: string, relativePath: string): string {
    const currentDir = currentPath.split('/').slice(0, -1).join('/');
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

  getFile(path: string): VirtualFile | undefined {
    return this.files.get(path);
  }

  getAllFiles(): VirtualFile[] {
    return Array.from(this.files.values());
  }

  getDependencies(path: string): string[] {
    return this.dependencies.get(path) || [];
  }

  updateFile(path: string, content: string) {
    const existingFile = this.files.get(path);
    if (existingFile) {
      existingFile.content = content;
      this.analyzeDependencies({
        id: '',
        name: path.split('/').pop() || '',
        path,
        content,
        language: existingFile.language,
        lastModified: new Date()
      });
    }
  }

  createBundleCode(entryPoint: string): string {
    const visited = new Set<string>();
    const modules: string[] = [];

    const processFile = (path: string) => {
      if (visited.has(path)) return;
      visited.add(path);

      const file = this.getFile(path);
      if (!file) return;

      // Process dependencies first
      const deps = this.getDependencies(path);
      deps.forEach(dep => processFile(dep));

      // Add this module
      const moduleCode = this.wrapAsModule(file);
      modules.push(moduleCode);
    };

    processFile(entryPoint);

    return `
      // Virtual File System Bundle
      const __modules = {};
      const __moduleCache = {};
      
      function __require(path) {
        if (__moduleCache[path]) return __moduleCache[path].exports;
        
        const module = { exports: {} };
        __moduleCache[path] = module;
        
        if (__modules[path]) {
          __modules[path](module, module.exports, __require);
        }
        
        return module.exports;
      }
      
      ${modules.join('\n\n')}
      
      // Execute entry point
      __require('${entryPoint}');
    `;
  }

  private wrapAsModule(file: VirtualFile): string {
    return `
      __modules['${file.path}'] = function(module, exports, require) {
        ${file.content}
      };
    `;
  }
}
