
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  ExternalLink, 
  Code2,
  FileText,
  AlertCircle
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";
import PreviewPaneControls from "./PreviewPaneControls";
import FileExplorerEnhanced from "./FileExplorerEnhanced";

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
  const [previewUrl, setPreviewUrl] = useState<string>('about:blank');
  const [isVisible, setIsVisible] = useState(true);
  const { activeProject } = useProjectStore();
  const { isDarkMode } = useUIStore();

  // Simulate preview URL generation based on project
  useEffect(() => {
    if (activeProject) {
      setPreviewUrl(`/preview/${activeProject.id}`);
    } else {
      setPreviewUrl('about:blank');
    }
  }, [activeProject]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const iframe = document.querySelector('#enhanced-preview-iframe') as HTMLIFrameElement;
      if (iframe) {
        const currentSrc = iframe.src;
        iframe.src = 'about:blank';
        setTimeout(() => {
          iframe.src = currentSrc;
        }, 100);
      }
    }, 500);
  }, []);

  const getSizeClasses = () => {
    switch (previewSize) {
      case 'mobile':
        return 'w-80 h-[568px] mx-auto';
      case 'tablet':
        return 'w-[768px] h-[1024px] mx-auto';
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
    <div className="flex-1 bg-white flex items-center justify-center overflow-auto">
      {(viewMode === 'preview' || viewMode === 'split') && isVisible ? (
        <div className={`${getSizeClasses()} border rounded shadow-lg bg-white transition-all duration-300`}>
          <iframe
            id="enhanced-preview-iframe"
            src={previewUrl}
            className="w-full h-full border-0 rounded"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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
        
        {/* Preview on right */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          <div className={`${getSizeClasses()} border rounded shadow-lg bg-white transition-all duration-300`}>
            <iframe
              id="enhanced-preview-iframe"
              src={previewUrl}
              className="w-full h-full border-0 rounded"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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
            {activeProject ? (
              <span className="text-[#F0F6FC]">{activeProject.name}</span>
            ) : (
              <span>No project selected</span>
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
            onClick={() => window.open(previewUrl, '_blank')}
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
            {viewMode === 'split' ? 'Split View' : viewMode === 'preview' ? `Preview (${previewSize})` : 'Code Tree'}
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Live</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPreviewPane;
