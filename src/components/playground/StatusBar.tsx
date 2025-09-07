
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileText,
  Settings,
  GitBranch,
  Zap
} from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";

const StatusBar = () => {
  const { activeTabId, tabs } = useEditorStore();
  const { currentStep, isProcessing } = useAIStore();
  const { activeProject } = useProjectStore();

  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const dirtyTabs = tabs.filter(tab => tab.isDirty);

  const getStatusColor = () => {
    if (isProcessing) return "text-[#1F6FEB]";
    if (currentStep) return "text-[#FFA657]";
    return "text-[#7C3AED]";
  };

  const getStatusText = () => {
    if (isProcessing) return "AI Processing...";
    if (currentStep) return `Step: ${currentStep}`;
    return "Ready";
  };

  return (
    <div className="h-6 bg-card/60 border-t border-border/40 px-4 flex items-center justify-between text-xs text-muted-foreground backdrop-blur-sm">
      {/* Left side - File info */}
      <div className="flex items-center space-x-4">
        {activeTab && (
          <>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span className="text-foreground">{activeTab.name}</span>
              {activeTab.isDirty && (
                <span className="text-orange-500">●</span>
              )}
            </div>
            <div className="text-muted-foreground">
              {activeTab.path}
            </div>
            <Badge variant="outline" className="h-4 text-[10px] border-border/60">
              {activeTab.language}
            </Badge>
          </>
        )}
        
        {activeProject && (
          <div className="flex items-center space-x-1">
            <GitBranch className="h-3 w-3" />
            <span>{activeProject.name}</span>
          </div>
        )}
      </div>

      {/* Right side - Status and actions */}
      <div className="flex items-center space-x-4">
        {dirtyTabs.length > 0 && (
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3 text-[#FFA657]" />
            <span>{dirtyTabs.length} unsaved</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          {isProcessing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : currentStep ? (
            <Zap className="h-3 w-3" />
          ) : (
            <CheckCircle className="h-3 w-3" />
          )}
          <span className={getStatusColor()}>{getStatusText()}</span>
        </div>

        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default StatusBar;
