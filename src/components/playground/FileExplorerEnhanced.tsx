
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  MoreHorizontal,
  Search,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore } from "@/stores/editorStore";

const FileExplorerEnhanced = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [searchQuery, setSearchQuery] = useState('');
  const { activeProject } = useProjectStore();
  const { openTab } = useEditorStore();

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

  const handleFileClick = (file: any) => {
    openTab({
      id: file.id,
      name: file.name,
      path: file.path,
      language: file.language
    });
  };

  // Sample file structure for demonstration
  const fileStructure = {
    'src': {
      type: 'folder',
      children: {
        'components': {
          type: 'folder',
          children: {
            'App.tsx': { type: 'file', language: 'typescript' },
            'Header.tsx': { type: 'file', language: 'typescript' },
          }
        },
        'pages': {
          type: 'folder',
          children: {
            'Home.tsx': { type: 'file', language: 'typescript' },
            'About.tsx': { type: 'file', language: 'typescript' },
          }
        },
        'lib': {
          type: 'folder',
          children: {
            'utils.ts': { type: 'file', language: 'typescript' },
            'api.ts': { type: 'file', language: 'typescript' },
          }
        }
      }
    },
    'package.json': { type: 'file', language: 'json' },
    'README.md': { type: 'file', language: 'markdown' },
  };

  const renderFileTree = (structure: any, path = '', depth = 0) => {
    return Object.entries(structure).map(([name, item]: [string, any]) => {
      const currentPath = path ? `${path}/${name}` : name;
      const isExpanded = expandedFolders.has(currentPath);
      
      if (item.type === 'folder') {
        return (
          <div key={currentPath}>
            <div
              className="flex items-center space-x-2 py-1 px-2 hover:bg-[#21262D] rounded cursor-pointer group"
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
              onClick={() => toggleFolder(currentPath)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-[#8B949E]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#8B949E]" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-[#1F6FEB]" />
              ) : (
                <Folder className="h-4 w-4 text-[#1F6FEB]" />
              )}
              <span className="text-sm text-[#F0F6FC] flex-1">{name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {isExpanded && (
              <div>
                {renderFileTree(item.children, currentPath, depth + 1)}
              </div>
            )}
          </div>
        );
      } else {
        const getFileIcon = (language: string) => {
          const colorMap: Record<string, string> = {
            typescript: 'text-blue-400',
            javascript: 'text-yellow-400',
            json: 'text-green-400',
            markdown: 'text-gray-400',
            css: 'text-pink-400',
            html: 'text-orange-400'
          };
          return colorMap[language] || 'text-[#8B949E]';
        };

        return (
          <div
            key={currentPath}
            className="flex items-center space-x-2 py-1 px-2 hover:bg-[#21262D] rounded cursor-pointer group"
            style={{ paddingLeft: `${depth * 16 + 32}px` }}
            onClick={() => handleFileClick({
              id: currentPath,
              name,
              path: currentPath,
              language: item.language
            })}
          >
            <File className={`h-4 w-4 ${getFileIcon(item.language)}`} />
            <span className="text-sm text-[#F0F6FC] flex-1">{name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        );
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-[#21262D]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="pl-9 bg-[#21262D] border-[#30363D] text-[#F0F6FC] placeholder:text-[#8B949E]"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-1">
          {activeProject ? (
            renderFileTree(fileStructure)
          ) : (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 text-[#30363D] mx-auto mb-3" />
              <p className="text-sm text-[#8B949E]">No project selected</p>
              <Button variant="outline" size="sm" className="mt-3">
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorerEnhanced;
