
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";

const EditorTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, openTab } = useEditorStore();
  const { activeProject } = useProjectStore();

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

  // Auto-open the first file if no tabs are open but project has files
  if (tabs.length === 0 && activeProject?.files && activeProject.files.length > 0) {
    const firstFile = activeProject.files[0];
    openTab({
      id: firstFile.id,
      name: firstFile.name,
      path: firstFile.path || firstFile.name,
      language: firstFile.language || 'javascript'
    });
  }

  if (tabs.length === 0) {
    return (
      <div className="border-b border-[#21262D] bg-[#161B22] px-4 py-3">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-[#8B949E]" />
          <div className="text-sm text-[#8B949E]">
            {activeProject?.files && activeProject.files.length > 0 
              ? 'Click a file to open it' 
              : 'No files in project'
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#21262D] bg-[#161B22] flex items-center overflow-x-auto min-h-[40px]">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center space-x-2 px-4 py-2 border-r border-[#21262D] cursor-pointer group min-w-0 max-w-48 ${
            tab.id === activeTabId 
              ? 'bg-[#0D1117] text-[#F0F6FC] border-b-2 border-[#1F6FEB]' 
              : 'bg-[#161B22] text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC]'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <FileText className={`h-4 w-4 flex-shrink-0 ${getFileIcon(tab.language)}`} />
          <span className="text-sm truncate flex-1">{tab.fileName}</span>
          {tab.isDirty && (
            <span className="text-[#FFA657] text-xs flex-shrink-0">●</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 ml-1 flex-shrink-0 hover:bg-[#30363D]"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
