
import { VirtualFileSystem } from '../virtualFileSystem';
import { ProjectFile, Project } from '@/stores/projectStore';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  dependencies?: string[];
}

export interface ProjectExportData {
  name: string;
  description: string;
  files: ProjectFile[];
  metadata: {
    exportedAt: Date;
    version: string;
    lovableVersion: string;
  };
}

export class LovableProjectManager {
  private vfs: VirtualFileSystem;
  private templates: Map<string, ProjectTemplate> = new Map();

  constructor(vfs: VirtualFileSystem) {
    this.vfs = vfs;
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // React Component Template
    this.templates.set('react-component', {
      id: 'react-component',
      name: 'React Component',
      description: 'A basic React functional component with TypeScript',
      files: [
        {
          path: 'src/components/MyComponent.tsx',
          content: `import React from 'react';

interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600">Welcome to your new component!</p>
    </div>
  );
};

export default MyComponent;`,
          language: 'tsx'
        },
        {
          path: 'src/App.tsx',
          content: `import React from 'react';
import MyComponent from './components/MyComponent';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <MyComponent title="Hello World" />
    </div>
  );
}

export default App;`,
          language: 'tsx'
        }
      ]
    });

    // React Hook Template
    this.templates.set('react-hook', {
      id: 'react-hook',
      name: 'Custom React Hook',
      description: 'A reusable custom React hook with TypeScript',
      files: [
        {
          path: 'src/hooks/useCounter.ts',
          content: `import { useState, useCallback } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounter = (initialValue: number = 0): UseCounterReturn => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset
  };
};`,
          language: 'typescript'
        },
        {
          path: 'src/components/CounterExample.tsx',
          content: `import React from 'react';
import { useCounter } from '../hooks/useCounter';

const CounterExample: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Counter: {count}</h2>
      <div className="space-x-2">
        <button 
          onClick={increment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +
        </button>
        <button 
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CounterExample;`,
          language: 'tsx'
        }
      ]
    });

    // Utility Function Template
    this.templates.set('utility-functions', {
      id: 'utility-functions',
      name: 'Utility Functions',
      description: 'Common utility functions with TypeScript',
      files: [
        {
          path: 'src/utils/helpers.ts',
          content: `// Date utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Array utilities
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Object utilities
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};`,
          language: 'typescript'
        }
      ]
    });
  }

  getTemplates(): ProjectTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplate(id: string): ProjectTemplate | null {
    return this.templates.get(id) || null;
  }

  async createFromTemplate(templateId: string, projectName: string): Promise<Project> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const project: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      description: template.description,
      files: template.files.map(file => ({
        id: crypto.randomUUID(),
        name: file.path.split('/').pop() || file.path,
        path: file.path,
        content: file.content,
        language: file.language,
        lastModified: new Date(),
        isGenerated: true
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft' as const
    };

    // Update VFS with new files
    project.files.forEach(file => {
      this.vfs.updateFile(file.path, file.content);
    });

    return project;
  }

  exportProject(project: Project): ProjectExportData {
    return {
      name: project.name,
      description: project.description,
      files: project.files,
      metadata: {
        exportedAt: new Date(),
        version: '1.0.0',
        lovableVersion: '2.0.0'
      }
    };
  }

  async importProject(exportData: ProjectExportData): Promise<Project> {
    const project: Project = {
      id: crypto.randomUUID(),
      name: exportData.name,
      description: exportData.description,
      files: exportData.files.map(file => ({
        ...file,
        id: crypto.randomUUID(),
        lastModified: new Date()
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft' as const
    };

    // Update VFS with imported files
    project.files.forEach(file => {
      this.vfs.updateFile(file.path, file.content);
    });

    return project;
  }

  validateProject(project: Project): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!project.name.trim()) {
      errors.push('Project name is required');
    }

    if (project.files.length === 0) {
      errors.push('Project must have at least one file');
    }

    // Check for duplicate file paths
    const paths = project.files.map(f => f.path);
    const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate file paths found: ${duplicates.join(', ')}`);
    }

    // Check for invalid file names
    project.files.forEach(file => {
      if (!file.name.trim()) {
        errors.push(`File name cannot be empty: ${file.path}`);
      }
      if (file.name.includes('/') || file.name.includes('\\')) {
        errors.push(`Invalid file name: ${file.name}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  generateProjectStructure(project: Project): string {
    const structure: string[] = [];
    const paths = project.files.map(f => f.path).sort();
    
    // Build tree structure
    const tree: any = {};
    paths.forEach(path => {
      const parts = path.split('/');
      let current = tree;
      parts.forEach(part => {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      });
    });

    // Convert tree to string representation
    const buildStructure = (node: any, prefix: string = '', isLast: boolean = true) => {
      const keys = Object.keys(node);
      keys.forEach((key, index) => {
        const isLastItem = index === keys.length - 1;
        const symbol = isLastItem ? '└── ' : '├── ';
        structure.push(prefix + symbol + key);
        
        if (Object.keys(node[key]).length > 0) {
          const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
          buildStructure(node[key], newPrefix, isLastItem);
        }
      });
    };

    structure.push(project.name + '/');
    buildStructure(tree, '');
    
    return structure.join('\n');
  }

  analyzeProject(project: Project): {
    fileCount: number;
    languages: Record<string, number>;
    totalLines: number;
    lastModified: Date;
    structure: string;
  } {
    const languages: Record<string, number> = {};
    let totalLines = 0;
    let lastModified = new Date(0);

    project.files.forEach(file => {
      // Count languages
      languages[file.language] = (languages[file.language] || 0) + 1;
      
      // Count lines
      totalLines += file.content.split('\n').length;
      
      // Track last modified
      if (file.lastModified > lastModified) {
        lastModified = file.lastModified;
      }
    });

    return {
      fileCount: project.files.length,
      languages,
      totalLines,
      lastModified,
      structure: this.generateProjectStructure(project)
    };
  }
}
