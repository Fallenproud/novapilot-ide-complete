
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Folder, 
  Search,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore } from "@/stores/editorStore";

const FileExplorerEnhanced = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components', 'src/pages']));
  const [searchQuery, setSearchQuery] = useState("");
  const { activeProject, setActiveFile } = useProjectStore();
  const { openTab, activeTabId } = useEditorStore();

  const handleFileClick = (file: any) => {
    // Open the file in editor tabs
    openTab({
      id: file.id,
      name: file.name,
      path: file.path,
      language: file.language,
      fileId: file.id
    });
    // Also update the activeFile in project store for consistency
    setActiveFile(file);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (language: string) => {
    switch (language) {
      case 'javascript':
      case 'typescript':
        return '📄';
      case 'jsx':
      case 'tsx':
        return '⚛️';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      case 'json':
        return '📋';
      case 'markdown':
        return '📝';
      default:
        return '📄';
    }
  };

  const organizeFilesByFolder = (files: any[]) => {
    const folderStructure: { [key: string]: any[] } = {};
    const rootFiles: any[] = [];

    files.forEach(file => {
      const pathParts = file.path.split('/');
      if (pathParts.length === 1) {
        rootFiles.push(file);
      } else {
        const folderPath = pathParts.slice(0, -1).join('/');
        if (!folderStructure[folderPath]) {
          folderStructure[folderPath] = [];
        }
        folderStructure[folderPath].push(file);
      }
    });

    return { folderStructure, rootFiles };
  };

  if (!activeProject || !activeProject.files) {
    return (
      <div className="h-full flex items-center justify-center text-[#8B949E]">
        <div className="text-center">
          <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No project loaded</p>
        </div>
      </div>
    );
  }

  const filteredFiles = activeProject.files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { folderStructure, rootFiles } = organizeFilesByFolder(filteredFiles);

  const renderFile = (file: any, isActive: boolean = false) => (
    <div
      key={file.id}
      className={`flex items-center space-x-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-[#21262D] rounded-md transition-colors ${
        isActive ? 'bg-[#1F6FEB] text-white' : 'text-[#F0F6FC]'
      }`}
      onClick={() => handleFileClick(file)}
    >
      <span className="text-base">{getFileIcon(file.language)}</span>
      <FileText className="h-4 w-4 opacity-70" />
      <span className="flex-1 truncate">{file.name}</span>
      {file.lastModified && (
        <span className="text-xs opacity-50">
          {new Date(file.lastModified).toLocaleDateString()}
        </span>
      )}
    </div>
  );

  const renderFolder = (folderPath: string, files: any[]) => {
    const isExpanded = expandedFolders.has(folderPath);
    const folderName = folderPath.split('/').pop() || folderPath;

    return (
      <div key={folderPath} className="mb-1">
        <div
          className="flex items-center space-x-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-[#21262D] rounded-md transition-colors text-[#F0F6FC]"
          onClick={() => toggleFolder(folderPath)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <Folder className="h-4 w-4 opacity-70" />
          <span className="flex-1">{folderName}</span>
          <span className="text-xs opacity-50">{files.length}</span>
        </div>
        
        {isExpanded && (
          <div className="ml-6 space-y-0.5">
            {files.map(file => {
              const isActive = activeTabId === file.id;
              return renderFile(file, isActive);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#161B22]">
      {/* Header */}
      <div className="p-3 border-b border-[#21262D]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-[#F0F6FC]">Files</h3>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-[#8B949E]" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-7 text-xs bg-[#0D1117] border-[#21262D] text-[#F0F6FC] placeholder-[#8B949E]"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-0.5">
          {/* Root files */}
          {rootFiles.map(file => {
            const isActive = activeTabId === file.id;
            return renderFile(file, isActive);
          })}
          
          {/* Folders */}
          {Object.entries(folderStructure).map(([folderPath, files]) =>
            renderFolder(folderPath, files)
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#21262D] text-xs text-[#8B949E]">
        <div className="flex justify-between items-center">
          <span>{filteredFiles.length} files</span>
          <span>{activeProject.name}</span>
        </div>
      </div>
    </div>
  );
};

export default FileExplorerEnhanced;
