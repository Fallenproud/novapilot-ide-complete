import React, { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { Monitor, RotateCcw, Minimize2, Maximize2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DynamicPreviewProps {
  mode: 'preview' | 'mini';
  onModeChange: (mode: 'preview' | 'mini') => void;
}

const DynamicPreview: React.FC<DynamicPreviewProps> = ({ mode, onModeChange }) => {
  const { activeProject } = useProjectStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generatePreviewContent = () => {
    if (!activeProject) return '';

    const htmlFile = activeProject.files.find(f => f.name === 'index.html');
    const cssFile = activeProject.files.find(f => f.name === 'style.css' || f.name === 'styles.css');
    const jsFile = activeProject.files.find(f => f.name === 'script.js' || f.name === 'main.js');

    const htmlContent = htmlFile?.content || `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${activeProject.name}</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.1rem;
            line-height: 1.6;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ${activeProject.name}</h1>
        <p>This is your live preview. Edit your HTML, CSS, and JavaScript files to see changes in real-time.</p>
        <p>Project created with NovaPilot IDE - Advanced Development Environment</p>
    </div>
</body>
</html>`;

    // Inject CSS and JS into HTML
    let finalHtml = htmlContent;

    if (cssFile?.content) {
      finalHtml = finalHtml.replace(
        '</head>',
        `<style>${cssFile.content}</style></head>`
      );
    }

    if (jsFile?.content) {
      finalHtml = finalHtml.replace(
        '</body>',
        `<script>${jsFile.content}</script></body>`
      );
    }

    return finalHtml;
  };

  const refreshPreview = () => {
    setIsLoading(true);
    const content = generatePreviewContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshPreview();
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [activeProject]);

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className="h-full bg-background flex flex-col border-l border-border">
      <div className="p-3 border-b border-border bg-muted/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Live Preview</h3>
            {activeProject && (
              <span className="text-xs text-muted-foreground">
                {activeProject.name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              title="Open in New Tab"
              onClick={openInNewTab}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              title="Refresh Preview"
              onClick={refreshPreview}
              disabled={isLoading}
            >
              <RotateCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              title="Toggle Size"
              onClick={() => onModeChange(mode === 'preview' ? 'mini' : 'preview')}
            >
              {mode === 'preview' ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-background p-2 min-h-0">
        <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading preview...</span>
              </div>
            </div>
          )}
          {previewUrl ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No preview available</p>
                <p className="text-xs">Create HTML files to see live preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicPreview;