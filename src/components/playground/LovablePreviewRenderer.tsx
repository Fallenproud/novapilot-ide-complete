
import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, Loader2, Play, Square, RefreshCw, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectFile } from "@/stores/projectStore";
import { VirtualFileSystem } from "@/services/virtualFileSystem";
import { EnhancedLovableRuntime } from "@/services/lovable/enhancedRuntime";
import DevToolsPanel from "./DevToolsPanel";

interface LovablePreviewRendererProps {
  activeFile: ProjectFile | null;
  allFiles: ProjectFile[];
  isVisible: boolean;
  className?: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const LovablePreviewRenderer = ({ 
  activeFile, 
  allFiles, 
  isVisible, 
  className = "",
  onToggleFullscreen,
  isFullscreen = false
}: LovablePreviewRendererProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<Array<{level: string, args: any[], timestamp: number}>>([]);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runtimeRef = useRef<EnhancedLovableRuntime | null>(null);
  const vfsRef = useRef<VirtualFileSystem | null>(null);

  // Initialize Enhanced Lovable Runtime
  useEffect(() => {
    if (allFiles.length > 0) {
      vfsRef.current = new VirtualFileSystem(allFiles);
      runtimeRef.current = new EnhancedLovableRuntime(vfsRef.current, {
        enableHMR: true,
        enableDevTools: true,
        enablePackageRegistry: true,
        enableTypeChecking: true,
        sandboxed: true
      });

      // Listen for runtime events
      const handleRuntimeError = (event: CustomEvent) => {
        setError(`Runtime Error: ${event.detail.args.join(' ')}`);
      };

      const handleHMRUpdate = (event: CustomEvent) => {
        console.log('HMR Update:', event.detail);
        // Automatically refresh preview on HMR update
        if (isRunning) {
          compileAndRun();
        }
      };

      const handleHMRFullReload = () => {
        console.log('HMR Full Reload');
        compileAndRun();
      };

      window.addEventListener('runtime:error', handleRuntimeError as EventListener);
      window.addEventListener('hmr:update', handleHMRUpdate as EventListener);
      window.addEventListener('hmr:full-reload', handleHMRFullReload);
      
      return () => {
        window.removeEventListener('runtime:error', handleRuntimeError as EventListener);
        window.removeEventListener('hmr:update', handleHMRUpdate as EventListener);
        window.removeEventListener('hmr:full-reload', handleHMRFullReload);
        runtimeRef.current?.dispose();
      };
    }
  }, [allFiles]);

  // Auto-compile on file changes with HMR
  useEffect(() => {
    if (activeFile && isRunning && runtimeRef.current) {
      // Emit file change event for HMR
      window.dispatchEvent(new CustomEvent('vfs:file-changed', {
        detail: {
          filePath: activeFile.path,
          content: activeFile.content
        }
      }));
    }
  }, [activeFile?.content, isRunning]);

  const compileAndRun = useCallback(async () => {
    if (!activeFile || !runtimeRef.current) return;

    setIsCompiling(true);
    setError(null);
    setConsoleOutput([]);

    try {
      // Execute the module
      const moduleExports = await runtimeRef.current.executeModule(activeFile.path);
      
      // Create preview HTML
      const previewHtml = createEnhancedPreviewHTML(activeFile, moduleExports);
      updatePreview(previewHtml);

      setIsRunning(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
      console.error('Enhanced Lovable execution error:', err);
    } finally {
      setIsCompiling(false);
    }
  }, [activeFile]);

  const createEnhancedPreviewHTML = (file: ProjectFile, moduleExports: any): string => {
    const isReactComponent = file.language.includes('jsx') || file.language.includes('tsx') || 
                            file.content.includes('React.createElement') || 
                            file.content.includes('JSX');

    if (isReactComponent) {
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <style>
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f8f9fa;
    }
    #root { min-height: 100vh; padding: 20px; }
    .lovable-error { 
      color: #dc3545; 
      padding: 20px; 
      background: #f8d7da; 
      border-radius: 8px; 
      margin: 20px;
      border: 1px solid #f5c6cb;
    }
    .hmr-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .hmr-indicator.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="hmr-indicator" class="hmr-indicator">🔥 HMR Updated</div>
  
  <script>
    // HMR indicator
    let hmrTimeout;
    window.addEventListener('message', function(event) {
      if (event.data.type === 'hmr-update') {
        const indicator = document.getElementById('hmr-indicator');
        indicator.classList.add('show');
        clearTimeout(hmrTimeout);
        hmrTimeout = setTimeout(() => {
          indicator.classList.remove('show');
        }, 2000);
      }
    });

    // Enhanced Error Boundary with HMR support
    class EnhancedErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Enhanced Lovable Runtime Error:', error, errorInfo);
        
        // Send error to parent
        window.parent.postMessage({
          type: 'runtime-error',
          error: error.message,
          stack: error.stack
        }, '*');
      }

      componentDidUpdate(prevProps) {
        // Reset error boundary on HMR updates
        if (this.state.hasError && prevProps.children !== this.props.children) {
          this.setState({ hasError: false, error: null });
        }
      }

      render() {
        if (this.state.hasError) {
          return React.createElement('div', { className: 'lovable-error' }, [
            React.createElement('h3', { key: 'title' }, 'Runtime Error'),
            React.createElement('p', { key: 'message' }, this.state.error?.message || 'An error occurred'),
            React.createElement('button', { 
              key: 'retry',
              onClick: () => this.setState({ hasError: false, error: null }),
              style: { 
                background: '#007bff', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }
            }, 'Retry')
          ]);
        }
        return this.props.children;
      }
    }

    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      
      // Try to find and render the main component
      let ComponentToRender = null;
      
      // Check for common export patterns
      if (typeof App !== 'undefined') {
        ComponentToRender = App;
      } else if (typeof Component !== 'undefined') {
        ComponentToRender = Component;
      } else if (typeof ${file.name.replace(/\.[^/.]+$/, "")} !== 'undefined') {
        ComponentToRender = ${file.name.replace(/\.[^/.]+$/, "")};
      } else {
        // Create a component from the module exports
        ComponentToRender = function() {
          return React.createElement('div', { 
            style: { padding: '20px' } 
          }, [
            React.createElement('h2', { key: 'title' }, 'Enhanced Lovable Preview'),
            React.createElement('p', { key: 'desc' }, 'Your code is running with HMR support!'),
            React.createElement('div', {
              key: 'status',
              style: {
                background: '#e7f3ff',
                padding: '12px',
                borderLeft: '4px solid #0066cc',
                marginTop: '16px'
              }
            }, [
              React.createElement('strong', { key: 'label' }, 'Status: '),
              'Module executed successfully with Enhanced Runtime'
            ])
          ]);
        };
      }
      
      root.render(
        React.createElement(EnhancedErrorBoundary, null,
          React.createElement(ComponentToRender)
        )
      );
      
    } catch (error) {
      console.error('Execution Error:', error);
      document.getElementById('root').innerHTML = 
        '<div class="lovable-error"><h3>Execution Error</h3><p>' + error.message + '</p></div>';
    }
  </script>
</body>
</html>`;
    } else {
      // JavaScript/other file execution
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f8f9fa;
    }
    #output {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-height: 200px;
    }
    .enhanced-badge {
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 16px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="enhanced-badge">Enhanced Lovable Runtime</div>
  <div id="output"></div>
  <script>
    const output = document.getElementById('output');
    const console = {
      log: (...args) => {
        const div = document.createElement('div');
        div.textContent = args.join(' ');
        div.style.marginBottom = '8px';
        output.appendChild(div);
      },
      error: (...args) => {
        const div = document.createElement('div');
        div.style.color = '#dc3545';
        div.textContent = 'Error: ' + args.join(' ');
        output.appendChild(div);
      }
    };
    
    try {
      // Module exports are available here
      if (typeof moduleExports !== 'undefined') {
        console.log('Module executed successfully');
        console.log('Exports:', moduleExports);
      }
    } catch (error) {
      console.error(error.message);
    }
  </script>
</body>
</html>`;
    }
  };

  const updatePreview = (html: string) => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
      
      // Send HMR update message to iframe
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'hmr-update' }, '*');
        }
      }, 100);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = '';
    }
    setConsoleOutput([]);
  };

  const handleRefresh = () => {
    if (isRunning && runtimeRef.current) {
      runtimeRef.current.clearCache();
      compileAndRun();
    }
  };

  if (!isVisible) {
    return (
      <div className={`flex items-center justify-center bg-background ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="text-sm">Enhanced Lovable Preview Hidden</div>
          <div className="text-xs mt-1">Press the play button to run with HMR</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Enhanced Controls */}
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={isRunning ? handleStop : compileAndRun}
          disabled={isCompiling}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isCompiling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRunning ? (
            <Square className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="ml-1">
            {isCompiling ? 'Compiling' : isRunning ? 'Stop' : 'Run Enhanced'}
          </span>
        </Button>
        
        {isRunning && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-background/80 backdrop-blur-sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDevTools(!showDevTools)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Bug className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={`flex items-center justify-center bg-background ${className}`}>
          <div className="text-center text-destructive p-6 max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto mb-3" />
            <div className="text-lg font-medium mb-2">Enhanced Runtime Error</div>
            <div className="text-sm bg-destructive/10 p-3 rounded-md whitespace-pre-wrap">
              {error}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={compileAndRun}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Preview Frame */}
      {!error && (
        <div className="flex-1 flex flex-col">
          <iframe
            ref={iframeRef}
            className="flex-1 w-full border-0 bg-background rounded-md"
            title="Enhanced Lovable Live Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
          
          {/* DevTools Panel */}
          {showDevTools && (
            <DevToolsPanel
              isVisible={showDevTools}
              onToggle={() => setShowDevTools(false)}
              className="h-64"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LovablePreviewRenderer;
