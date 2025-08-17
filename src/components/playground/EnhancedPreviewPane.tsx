import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  ExternalLink, 
  FileText,
  AlertCircle,
  Maximize2,
  Zap
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore } from "@/stores/editorStore";
import PreviewPaneControls from "./PreviewPaneControls";
import FileExplorerEnhanced from "./FileExplorerEnhanced";
import EnhancedLivePreviewRenderer from "./EnhancedLivePreviewRenderer";
import LovablePreviewRenderer from "./LovablePreviewRenderer";

type ViewMode = 'preview' | 'code' | 'split';
type PreviewSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';
type LayoutMode = 'right' | 'bottom' | 'floating';
type PreviewEngine = 'enhanced' | 'lovable';

interface EnhancedPreviewPaneProps {
  layoutMode?: LayoutMode;
}

const EnhancedPreviewPane = ({ layoutMode = 'right' }: EnhancedPreviewPaneProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { activeProject } = useProjectStore();
  const { activeTabId, tabs } = useEditorStore();

  // Get active file and all project files
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const activeFile = activeProject?.files.find(f => f.id === activeTab?.fileId) || null;
  const allFiles = activeProject?.files || [];
  const currentLanguage = activeTab?.language || 'javascript';

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);



  return (
    <div className="h-full bg-[#161B22] flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#21262D] border-b border-[#30363D]">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-[#8B949E]">
            {activeProject && activeFile ? (
              <span className="text-[#F0F6FC]">{activeFile.name}</span>
            ) : (
              <span>No file selected</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh Preview"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleToggleFullscreen}
            title="Fullscreen Preview"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => {
              if (activeFile?.content) {
                const blob = new Blob([activeFile.content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
              }
            }}
            title="Open in New Tab"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Live Preview Area */}
      <div className="flex-1 bg-white overflow-hidden">
        {isFullscreen ? (
          <div className="fixed inset-0 z-50 bg-white">
            <LovablePreviewRenderer
              activeFile={activeFile}
              allFiles={allFiles}
              isVisible={true}
              className="w-full h-full"
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={true}
            />
          </div>
        ) : (
          <LovablePreviewRenderer
            activeFile={activeFile}
            allFiles={allFiles}
            isVisible={true}
            className="w-full h-full"
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={false}
          />
        )}
      </div>
      
      {/* Status Footer */}
      <div className="border-t border-[#21262D] px-4 py-1 text-xs text-[#8B949E] bg-[#0D1117]">
        <div className="flex justify-between items-center">
          <span>⚡ Live Preview</span>
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Live</span>
            </span>
            {allFiles.length > 1 && (
              <span className="text-[#8B949E]">
                {allFiles.length} files
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPreviewPane;
