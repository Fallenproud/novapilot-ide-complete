
import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";

const FILE_STRUCTURE = {
  'src': {
    type: 'folder',
    children: {
      'components': {
        type: 'folder',
        children: {
          'ui': {
            type: 'folder',
            children: {
              'button.tsx': { type: 'file' },
              'card.tsx': { type: 'file' },
              'input.tsx': { type: 'file' },
            }
          },
          'TaskCard.tsx': { type: 'file' },
          'TaskBoard.tsx': { type: 'file' },
          'Header.tsx': { type: 'file' },
        }
      },
      'lib': {
        type: 'folder',
        children: {
          'utils.ts': { type: 'file' },
          'api.ts': { type: 'file' },
        }
      },
      'pages': {
        type: 'folder',
        children: {
          'dashboard.tsx': { type: 'file' },
          'login.tsx': { type: 'file' },
        }
      },
      'App.tsx': { type: 'file' },
      'main.tsx': { type: 'file' },
    }
  },
  'package.json': { type: 'file' },
  'tailwind.config.ts': { type: 'file' },
  'vite.config.ts': { type: 'file' },
};

const FileExplorer = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components']));

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFileTree = (structure: any, path = '', depth = 0) => {
    return Object.entries(structure).map(([name, item]: [string, any]) => {
      const currentPath = path ? `${path}/${name}` : name;
      const isExpanded = expandedFolders.has(currentPath);

      if (item.type === 'folder') {
        return (
          <div key={currentPath}>
            <div
              className="flex items-center space-x-2 py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer"
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
              onClick={() => toggleFolder(currentPath)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm font-medium">{name}</span>
            </div>
            {isExpanded && (
              <div>
                {renderFileTree(item.children, currentPath, depth + 1)}
              </div>
            )}
          </div>
        );
      } else {
        const getFileColor = (fileName: string) => {
          if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return 'text-blue-600';
          if (fileName.endsWith('.ts') || fileName.endsWith('.js')) return 'text-yellow-600';
          if (fileName.endsWith('.json')) return 'text-green-600';
          return 'text-gray-600';
        };

        return (
          <div
            key={currentPath}
            className="flex items-center space-x-2 py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded cursor-pointer"
            style={{ paddingLeft: `${depth * 16 + 32}px` }}
          >
            <File className={`h-4 w-4 ${getFileColor(name)}`} />
            <span className="text-sm">{name}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className="h-full overflow-auto p-2">
      <div className="mb-4 px-2">
        <h3 className="text-sm font-medium text-muted-foreground">PROJECT FILES</h3>
      </div>
      <div className="space-y-1">
        {renderFileTree(FILE_STRUCTURE)}
      </div>
    </div>
  );
};

export default FileExplorer;
