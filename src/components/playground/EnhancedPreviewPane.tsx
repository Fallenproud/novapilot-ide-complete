
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  ExternalLink, 
  FileText,
  AlertCircle,
  Maximize2
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore } from "@/stores/editorStore";
import PreviewPaneControls from "./PreviewPaneControls";
import FileExplorerEnhanced from "./FileExplorerEnhanced";
import EnhancedLivePreviewRenderer from "./EnhancedLivePreviewRenderer";

type ViewMode = 'preview' | 'code' | 'split';
type PreviewSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';
type LayoutMode = 'right' | 'bottom' | 'floating';

interface EnhancedPreviewPaneProps {
  layoutMode?: LayoutMode;
}

const EnhancedPreviewPane = ({ layoutMode = 'right' }: EnhancedPreviewPaneProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [previewSize, setPreviewSize] = useState<PreviewSize>('desktop');
  const [currentLayoutMode, setCurrentLayoutMode] = useState<LayoutMode>(layoutMode);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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

  const getSizeClasses = () => {
    if (isFullscreen) return 'w-full h-full';
    
    switch (previewSize) {
      case 'mobile':
        return 'w-80 h-[568px] mx-auto';
      case 'tablet':
        return 'w-[768px] h-[600px] mx-auto';
      case 'desktop':
        return 'w-full h-full';
      case 'fullscreen':
        return 'w-full h-full';
      default:
        return 'w-full h-full';
    }
  };

  const getContainerClasses = () => {
    const baseClasses = "bg-[#161B22] flex flex-col";
    
    if (isFullscreen) {
      return `${baseClasses} fixed inset-0 z-50 bg-background`;
    }
    
    switch (currentLayoutMode) {
      case 'right':
        return `${baseClasses} w-96 border-l border-[#21262D]`;
      case 'bottom':
        return `${baseClasses} h-80 border-t border-[#21262D]`;
      case 'floating':
        return `${baseClasses} fixed top-20 right-4 w-96 h-[500px] rounded-lg shadow-2xl border border-[#21262D] z-50`;
      default:
        return `${baseClasses} w-96 border-l border-[#21262D]`;
    }
  };

  const PreviewContent = () => (
    <div className="flex-1 bg-[#F5F5F5] flex items-center justify-center overflow-auto">
      {(viewMode === 'preview' || viewMode === 'split') && isVisible ? (
        <div className={`${getSizeClasses()} border rounded shadow-lg bg-white transition-all duration-300 overflow-hidden`}>
          <EnhancedLivePreviewRenderer
            activeFile={activeFile}
            allFiles={allFiles}
            language={currentLanguage}
            isVisible={isVisible}
            className="w-full h-full"
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>
      ) : viewMode === 'code' ? (
        <div className="w-full h-full">
          <FileExplorerEnhanced />
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Preview hidden</p>
          <p className="text-xs mt-1">Press Ctrl+Shift+P to show</p>
        </div>
      )}
    </div>
  );

  const SplitView = () => (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex">
        {/* Code tree on left */}
        <div className="w-1/2 border-r border-[#21262D]">
          <div className="p-2 bg-[#21262D] border-b border-[#30363D]">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-[#8B949E]" />
              <span className="text-xs font-medium text-[#F0F6FC]">Project Files</span>
            </div>
          </div>
          <FileExplorerEnhanced />
        </div>
        
        {/* Live preview on right */}
        <div className="w-1/2 bg-[#F5F5F5] flex items-center justify-center">
          <div className={`${getSizeClasses()} border rounded shadow-lg bg-white transition-all duration-300 overflow-hidden`}>
            <EnhancedLivePreviewRenderer
              activeFile={activeFile}
              allFiles={allFiles}
              language={currentLanguage}
              isVisible={isVisible}
              className="w-full h-full"
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={getContainerClasses()}>
      {/* Enhanced Controls Header */}
      <PreviewPaneControls
        viewMode={viewMode}
        previewSize={previewSize}
        layoutMode={currentLayoutMode}
        isVisible={isVisible}
        onViewModeChange={setViewMode}
        onPreviewSizeChange={setPreviewSize}
        onLayoutModeChange={setCurrentLayoutMode}
        onVisibilityToggle={() => setIsVisible(!isVisible)}
      />

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#21262D] border-b border-[#30363D]">
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
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleToggleFullscreen}
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
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Main Content Area */}
      {viewMode === 'split' ? <SplitView /> : <PreviewContent />}
      
      {/* Status Footer */}
      <div className="border-t border-[#21262D] px-4 py-1 text-xs text-[#8B949E] bg-[#0D1117]">
        <div className="flex justify-between items-center">
          <span>
            {viewMode === 'split' ? 'Split View' : viewMode === 'preview' ? `Live Preview (${previewSize})` : 'Code Tree'}
          </span>
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
