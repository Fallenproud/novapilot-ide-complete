
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";

const EditorTabs = () => {
  const { tabs, activeTabId, closeTab, setActiveTab } = useEditorStore();
  const { activeProject } = useProjectStore();

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

  if (tabs.length === 0) {
    return (
      <div className="h-10 bg-[#161B22] border-b border-[#21262D] flex items-center px-4">
        <div className="text-sm text-[#8B949E]">No files open</div>
      </div>
    );
  }

  return (
    <div className="h-10 bg-[#161B22] border-b border-[#21262D] flex items-center overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const file = activeProject?.files.find(f => f.id === tab.fileId);
        
        return (
          <div
            key={tab.id}
            className={`flex items-center space-x-2 px-3 py-2 text-sm cursor-pointer border-r border-[#21262D] min-w-0 ${
              isActive 
                ? 'bg-[#0D1117] text-[#F0F6FC] border-b-2 border-b-[#1F6FEB]' 
                : 'bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-xs">{getFileIcon(tab.language)}</span>
            <FileText className="h-3 w-3 opacity-70 flex-shrink-0" />
            <span className="truncate max-w-[120px]" title={tab.name}>
              {tab.name}
            </span>
            {file?.lastModified && (
              <div className={`w-2 h-2 rounded-full ${
                // Show modified indicator if file has been changed recently
                new Date().getTime() - new Date(file.lastModified).getTime() < 60000
                  ? 'bg-orange-500' 
                  : 'bg-transparent'
              }`} />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-50 hover:opacity-100 ml-1 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
