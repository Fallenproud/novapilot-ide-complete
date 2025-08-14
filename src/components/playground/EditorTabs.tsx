
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";

const EditorTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore();

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

  if (tabs.length === 0) {
    return (
      <div className="border-b border-[#21262D] bg-[#161B22] px-4 py-2">
        <div className="text-sm text-[#8B949E]">No files open</div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#21262D] bg-[#161B22] flex items-center overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center space-x-2 px-3 py-2 border-r border-[#21262D] cursor-pointer group min-w-0 ${
            tab.id === activeTabId 
              ? 'bg-[#0D1117] text-[#F0F6FC]' 
              : 'bg-[#161B22] text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC]'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <FileText className={`h-4 w-4 flex-shrink-0 ${getFileIcon(tab.language)}`} />
          <span className="text-sm truncate max-w-32">{tab.fileName}</span>
          {tab.isDirty && (
            <span className="text-[#FFA657] text-xs">●</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0"
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
