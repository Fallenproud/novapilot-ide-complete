
import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, Loader2, Play, Square, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectFile } from "@/stores/projectStore";
import { VirtualFileSystem } from "@/services/virtualFileSystem";
import { LovableRuntime } from "@/services/lovable/runtime";
import { LovableCompiler, CompilationResult } from "@/services/lovable/compiler";

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
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<Array<{level: string, args: any[], timestamp: number}>>([]);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runtimeRef = useRef<LovableRuntime | null>(null);
  const compilerRef = useRef<LovableCompiler | null>(null);
  const vfsRef = useRef<VirtualFileSystem | null>(null);

  // Initialize Lovable systems
  useEffect(() => {
    if (allFiles.length > 0) {
      vfsRef.current = new VirtualFileSystem(allFiles);
      compilerRef.current = new LovableCompiler();
      runtimeRef.current = new LovableRuntime(vfsRef.current, {
        enableHMR: true,
        enableTypeChecking: true,
        sandboxed: true
      });

      // Listen for console events
      const handleConsoleEvent = (event: CustomEvent) => {
        setConsoleOutput(prev => [...prev, event.detail]);
      };

      window.addEventListener('lovable:console', handleConsoleEvent as EventListener);
      
      return () => {
        window.removeEventListener('lovable:console', handleConsoleEvent as EventListener);
        runtimeRef.current?.dispose();
        compilerRef.current?.dispose();
      };
    }
  }, [allFiles]);

  const compileAndRun = useCallback(async () => {
    if (!activeFile || !compilerRef.current || !runtimeRef.current) return;

    setIsCompiling(true);
    setError(null);
    setConsoleOutput([]);

    try {
      // Compile the active file
      let result: CompilationResult;
      
      if (activeFile.language === 'typescript' || activeFile.language === 'tsx') {
        result = await compilerRef.current.compileTypeScript(activeFile.content, activeFile.path);
      } else if (activeFile.language === 'javascript' || activeFile.language === 'jsx') {
        result = await compilerRef.current.compileJavaScript(activeFile.content, activeFile.path);
      } else if (activeFile.language === 'css') {
        result = await compilerRef.current.compileCSS(activeFile.content, activeFile.path);
      } else {
        throw new Error(`Unsupported file type: ${activeFile.language}`);
      }

      setCompilationResult(result);

      if (result.errors.length > 0) {
        setError(result.errors.map(e => e.message).join('\n'));
        return;
      }

      // Update VFS with compiled code
      vfsRef.current?.updateFile(activeFile.path, result.code);

      // Execute in runtime
      if (activeFile.language !== 'css') {
        const moduleExports = await runtimeRef.current.executeModule(activeFile.path);
        
        // Create preview HTML
        const previewHtml = createLovablePreviewHTML(result.code, activeFile.language, moduleExports);
        updatePreview(previewHtml);
      } else {
        // Handle CSS files
        const previewHtml = createCSSPreview(result.code);
        updatePreview(previewHtml);
      }

      setIsRunning(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Compilation failed');
    } finally {
      setIsCompiling(false);
    }
  }, [activeFile]);

  const createLovablePreviewHTML = (compiledCode: string, language: string, moduleExports: any): string => {
    const isReactComponent = language.includes('jsx') || language.includes('tsx') || 
                            compiledCode.includes('React.createElement') || 
                            compiledCode.includes('JSX');

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
    .lovable-console {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 200px;
      background: #1e1e1e;
      color: #fff;
      overflow-y: auto;
      border-top: 1px solid #333;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    .lovable-console-entry {
      padding: 4px 8px;
      border-bottom: 1px solid #333;
    }
    .lovable-console-log { color: #fff; }
    .lovable-console-error { color: #ff6b6b; }
    .lovable-console-warn { color: #ffd93d; }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="console" class="lovable-console" style="display: none;"></div>
  
  <script>
    // Console capture
    const consoleDiv = document.getElementById('console');
    const originalConsole = { ...console };
    
    ['log', 'error', 'warn', 'info'].forEach(method => {
      console[method] = (...args) => {
        originalConsole[method](...args);
        
        const entry = document.createElement('div');
        entry.className = 'lovable-console-entry lovable-console-' + method;
        entry.textContent = args.join(' ');
        consoleDiv.appendChild(entry);
        consoleDiv.style.display = 'block';
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
      };
    });

    // Error boundary
    class LovableErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Lovable Runtime Error:', error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return React.createElement('div', { className: 'lovable-error' }, [
            React.createElement('h3', { key: 'title' }, 'Runtime Error'),
            React.createElement('p', { key: 'message' }, this.state.error?.message || 'An error occurred'),
            React.createElement('pre', { key: 'stack' }, this.state.error?.stack || '')
          ]);
        }
        return this.props.children;
      }
    }

    try {
      // Execute compiled code
      ${compiledCode}
      
      // Try to render if it's a React component
      const root = ReactDOM.createRoot(document.getElementById('root'));
      
      // Try to find and render the main component
      let ComponentToRender = null;
      
      if (typeof App !== 'undefined') {
        ComponentToRender = App;
      } else if (typeof Component !== 'undefined') {
        ComponentToRender = Component;
      } else {
        // Create a default component showing the code execution
        ComponentToRender = () => React.createElement('div', { 
          style: { padding: '20px' } 
        }, [
          React.createElement('h2', { key: 'title' }, 'Code Executed Successfully'),
          React.createElement('p', { key: 'desc' }, 'Your code has been executed. Check the console for output.'),
          React.createElement('pre', { 
            key: 'code',
            style: { 
              background: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px'
            }
          }, ${JSON.stringify(compiledCode)})
        ]);
      }
      
      root.render(
        React.createElement(LovableErrorBoundary, null,
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
      // JavaScript execution
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
  </style>
</head>
<body>
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
      ${compiledCode}
    } catch (error) {
      console.error(error.message);
    }
  </script>
</body>
</html>`;
    }
  };

  const createCSSPreview = (css: string): string => {
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
    }
    ${css}
  </style>
</head>
<body>
  <div class="css-preview-container">
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

  const updatePreview = (html: string) => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
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
    if (isRunning) {
      compileAndRun();
    }
  };

  if (!isVisible) {
    return (
      <div className={`flex items-center justify-center bg-background ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="text-sm">Lovable Preview Hidden</div>
          <div className="text-xs mt-1">Press the play button to run your code</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Lovable Controls */}
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
            {isCompiling ? 'Compiling' : isRunning ? 'Stop' : 'Run'}
          </span>
        </Button>
        
        {isRunning && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="bg-background/80 backdrop-blur-sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Compilation Status */}
      {compilationResult && compilationResult.warnings.length > 0 && (
        <div className="absolute top-12 right-2 z-10 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs">
          <div className="font-medium">Warnings:</div>
          {compilationResult.warnings.map((warning, i) => (
            <div key={i}>{warning.message}</div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={`flex items-center justify-center bg-background ${className}`}>
          <div className="text-center text-destructive p-6 max-w-md">
            <AlertCircle className="h-12 w-12 mx-auto mb-3" />
            <div className="text-lg font-medium mb-2">Lovable Compilation Error</div>
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
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0 bg-background rounded-md"
          title="Lovable Live Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}

      {/* Console Output (if any) */}
      {consoleOutput.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 max-h-32 bg-gray-900 text-white text-xs overflow-y-auto">
          {consoleOutput.map((entry, i) => (
            <div key={i} className={`p-2 border-b border-gray-700 ${
              entry.level === 'error' ? 'text-red-400' : 
              entry.level === 'warn' ? 'text-yellow-400' : 'text-white'
            }`}>
              <span className="opacity-60">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>{' '}
              {entry.args.join(' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LovablePreviewRenderer;
