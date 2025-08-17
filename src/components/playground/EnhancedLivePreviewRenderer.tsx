
import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VirtualFileSystem } from "@/services/virtualFileSystem";
import { ProjectFile } from "@/stores/projectStore";
import { usePreviewKeyboard } from "@/hooks/usePreviewKeyboard";

interface EnhancedLivePreviewRendererProps {
  activeFile: ProjectFile | null;
  allFiles: ProjectFile[];
  language: string;
  isVisible: boolean;
  className?: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const EnhancedLivePreviewRenderer = ({ 
  activeFile, 
  allFiles, 
  language, 
  isVisible, 
  className = "",
  onToggleFullscreen,
  isFullscreen = false
}: EnhancedLivePreviewRendererProps) => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compiledHtml, setCompiledHtml] = useState<string>('');
  const [compilationProgress, setCompilationProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const compileTimeoutRef = useRef<NodeJS.Timeout>();
  const vfsRef = useRef<VirtualFileSystem | null>(null);

  // Keyboard shortcuts
  usePreviewKeyboard({
    onTogglePreview: () => {},
    onToggleFullscreen: onToggleFullscreen || (() => {}),
    onRefresh: () => handleRefresh(),
    onToggleViewMode: () => {}
  });

  const handleRefresh = useCallback(() => {
    if (activeFile) {
      compileCode(activeFile, allFiles);
    }
  }, [activeFile, allFiles]);

  const compileCode = useCallback(async (file: ProjectFile, projectFiles: ProjectFile[]) => {
    if (!file?.content.trim() || !isVisible) {
      setCompiledHtml('');
      return;
    }

    setIsCompiling(true);
    setError(null);
    setCompilationProgress(0);

    try {
      // Update VFS
      vfsRef.current = new VirtualFileSystem(projectFiles);
      
      setCompilationProgress(25);

      let htmlContent = '';

      if (file.language === 'html') {
        htmlContent = createAdvancedHtmlPreview(file.content);
      } else if (file.language === 'javascript' || file.language === 'typescript') {
        htmlContent = createAdvancedJsPreview(file.content, vfsRef.current);
      } else if (file.language === 'css') {
        htmlContent = createAdvancedCssPreview(file.content);
      } else if (file.language === 'markdown') {
        htmlContent = createAdvancedMarkdownPreview(file.content);
      } else {
        // For JSX/TSX or React components
        htmlContent = await createAdvancedReactPreview(file.content, vfsRef.current);
      }

      setCompilationProgress(75);
      setCompiledHtml(htmlContent);
      setCompilationProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compilation failed');
      console.error('Enhanced preview compilation error:', err);
    } finally {
      setTimeout(() => {
        setIsCompiling(false);
        setCompilationProgress(0);
      }, 200);
    }
  }, [isVisible]);

  const createAdvancedHtmlPreview = (html: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      margin: 0; 
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
    }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  ${html}
  <script>
    // Error handling for runtime errors
    window.addEventListener('error', function(e) {
      console.error('Runtime error:', e.error);
    });
  </script>
</body>
</html>`;
  };

  const createAdvancedCssPreview = (css: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      margin: 0; 
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    ${css}
  </style>
</head>
<body>
  <div class="preview-container">
    <h1>CSS Preview</h1>
    <p>This paragraph demonstrates your CSS styles.</p>
    <div class="demo-section">
      <button class="btn">Sample Button</button>
      <div class="box">Sample Box</div>
      <ul class="list">
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
    </div>
  </div>
</body>
</html>`;
  };

  const createAdvancedJsPreview = (js: string, vfs: VirtualFileSystem): string => {
    let bundledCode = js;
    
    try {
      // If there are multiple files and this looks like a module, create a bundle
      if (vfs.getAllFiles().length > 1) {
        bundledCode = vfs.createBundleCode(vfs.getAllFiles()[0].path);
      }
    } catch (e) {
      console.warn('Bundle creation failed, using single file:', e);
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      margin: 0; 
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f8f9fa;
    }
    #output {
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-height: 200px;
    }
    .error { color: #dc3545; padding: 12px; background: #f8d7da; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="output"></div>
  <script>
    const console = {
      log: (...args) => {
        const output = document.getElementById('output');
        const div = document.createElement('div');
        div.textContent = args.join(' ');
        div.style.marginBottom = '8px';
        output.appendChild(div);
      },
      error: (...args) => {
        const output = document.getElementById('output');
        const div = document.createElement('div');
        div.className = 'error';
        div.textContent = 'Error: ' + args.join(' ');
        output.appendChild(div);
      }
    };
    
    try {
      ${bundledCode}
    } catch (error) {
      console.error(error.message);
    }
  </script>
</body>
</html>`;
  };

  const createAdvancedMarkdownPreview = (markdown: string): string => {
    const htmlContent = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      margin: 0; 
      padding: 24px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3 { color: #2d3748; margin-top: 2rem; }
    code { background: #f7fafc; padding: 2px 4px; border-radius: 3px; }
    p { margin-bottom: 1rem; }
  </style>
</head>
<body>
  <p>${htmlContent}</p>
</body>
</html>`;
  };

  const createAdvancedReactPreview = async (reactCode: string, vfs: VirtualFileSystem): Promise<string> => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    #root { min-height: 100vh; }
    .error-boundary { 
      color: #dc3545; 
      padding: 20px; 
      background: #f8d7da; 
      border-radius: 8px; 
      margin: 20px;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="error-boundary">
              <h3>Component Error</h3>
              <p>{this.state.error?.message || 'An error occurred while rendering'}</p>
            </div>
          );
        }
        return this.props.children;
      }
    }

    try {
      ${reactCode.includes('export default') ? reactCode : `
        const App = () => {
          return (
            <div style={{padding: '20px'}}>
              <h2>Code Preview</h2>
              <pre style={{background: '#f8f9fa', padding: '16px', borderRadius: '8px', overflow: 'auto'}}>
                {${JSON.stringify(reactCode)}}
              </pre>
            </div>
          );
        };
      `}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        React.createElement(ErrorBoundary, null,
          React.createElement(App)
        )
      );
    } catch (error) {
      document.getElementById('root').innerHTML = 
        '<div class="error-boundary"><h3>Compilation Error</h3><p>' + error.message + '</p></div>';
    }
  </script>
</body>
</html>`;
  };

  // Debounced compilation effect
  useEffect(() => {
    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
    }

    compileTimeoutRef.current = setTimeout(() => {
      if (activeFile) {
        compileCode(activeFile, allFiles);
      }
    }, 300);

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
    };
  }, [activeFile, allFiles, compileCode]);

  if (!isVisible) {
    return (
      <div className={`flex items-center justify-center bg-background ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="text-sm">Preview hidden</div>
          <div className="text-xs mt-1">Press Ctrl+Shift+P to show</div>
        </div>
      </div>
    );
  }

  if (isCompiling) {
    return (
      <div className={`flex items-center justify-center bg-background ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <div className="text-sm text-foreground mb-2">Compiling...</div>
          <div className="w-32 h-1 bg-muted rounded-full mx-auto">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${compilationProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-background ${className}`}>
        <div className="text-center text-destructive p-6 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-3" />
          <div className="text-lg font-medium mb-2">Compilation Error</div>
          <div className="text-sm bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!compiledHtml) {
    return (
      <div className={`flex items-center justify-center bg-background ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="text-sm">No code to preview</div>
          <div className="text-xs mt-1">Start coding to see live preview</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Fullscreen toggle */}
      {onToggleFullscreen && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}
      
      <iframe
        ref={iframeRef}
        srcDoc={compiledHtml}
        className="w-full h-full border-0 bg-background rounded-md"
        title="Enhanced Live Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default EnhancedLivePreviewRenderer;
