
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  ExternalLink, 
  Maximize2, 
  Smartphone, 
  Tablet, 
  Monitor,
  Eye,
  EyeOff
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useUIStore } from "@/stores/uiStore";

type PreviewSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';

const PreviewPane = () => {
  const [previewSize, setPreviewSize] = useState<PreviewSize>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('about:blank');
  const [isVisible, setIsVisible] = useState(true);
  const { activeProject } = useProjectStore();
  const { isDarkMode } = useUIStore();

  // Simulate preview URL generation based on project
  useEffect(() => {
    if (activeProject) {
      // In a real implementation, this would be the dev server URL
      setPreviewUrl(`/preview/${activeProject.id}`);
    } else {
      setPreviewUrl('about:blank');
    }
  }, [activeProject]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      // Force iframe reload by changing src
      const iframe = document.querySelector('#preview-iframe') as HTMLIFrameElement;
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
        return 'w-80 h-[568px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      case 'desktop':
        return 'w-full h-full';
      case 'fullscreen':
        return 'w-full h-full';
      default:
        return 'w-full h-full';
    }
  };

  const getSizeIcon = (size: PreviewSize) => {
    switch (size) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'fullscreen':
        return <Maximize2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-96 border-l border-[#21262D] bg-[#161B22] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#21262D] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-[#8B949E]" />
          <span className="text-sm font-medium text-[#F0F6FC]">Preview</span>
          {activeProject && (
            <span className="text-xs text-[#8B949E]">({activeProject.name})</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Preview size controls */}
          {(['mobile', 'tablet', 'desktop'] as PreviewSize[]).map((size) => (
            <Button
              key={size}
              variant={previewSize === size ? "default" : "ghost"}
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setPreviewSize(size)}
            >
              {getSizeIcon(size)}
            </Button>
          ))}
          
          <div className="w-px h-4 bg-[#21262D] mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
          
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
      
      {/* Preview content */}
      <div className="flex-1 bg-white flex items-center justify-center overflow-auto">
        {isVisible ? (
          <div className={`${getSizeClasses()} border rounded shadow-lg bg-white transition-all duration-300`}>
            <iframe
              id="preview-iframe"
              src={previewUrl}
              className="w-full h-full border-0 rounded"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <EyeOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Preview hidden</p>
          </div>
        )}
      </div>
      
      {/* Preview info */}
      <div className="border-t border-[#21262D] px-4 py-2 text-xs text-[#8B949E]">
        <div className="flex justify-between items-center">
          <span>Size: {previewSize}</span>
          <span>Auto-refresh: On</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;
