
import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface LivePreviewRendererProps {
  code: string;
  language: string;
  isVisible: boolean;
  className?: string;
}

const LivePreviewRenderer = ({ code, language, isVisible, className = "" }: LivePreviewRendererProps) => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compiledHtml, setCompiledHtml] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const compileTimeoutRef = useRef<NodeJS.Timeout>();

  const compileCode = useCallback(async (sourceCode: string, lang: string) => {
    if (!sourceCode.trim() || !isVisible) {
      setCompiledHtml('');
      return;
    }

    setIsCompiling(true);
    setError(null);

    try {
      let htmlContent = '';

      if (lang === 'html') {
        htmlContent = createHtmlPreview(sourceCode);
      } else if (lang === 'javascript' || lang === 'typescript') {
        htmlContent = createJsPreview(sourceCode);
      } else if (lang === 'css') {
        htmlContent = createCssPreview(sourceCode);
      } else if (lang === 'markdown') {
        htmlContent = createMarkdownPreview(sourceCode);
      } else {
        // For JSX/TSX or unknown types, try to render as React
        htmlContent = await createReactPreview(sourceCode);
      }

      setCompiledHtml(htmlContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compilation failed');
      console.error('Preview compilation error:', err);
    } finally {
      setIsCompiling(false);
    }
  }, [isVisible]);

  const createHtmlPreview = (html: string): string => {
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
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  };

  const createCssPreview = (css: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    ${css}
  </style>
</head>
<body>
  <div class="preview-container">
    <h1>CSS Preview</h1>
    <p>This is a sample paragraph to demonstrate your CSS styles.</p>
    <button>Sample Button</button>
    <div class="box">Sample Box</div>
  </div>
</body>
</html>`;
  };

  const createJsPreview = (js: string): string => {
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
      background: #f5f5f5;
    }
    #output {
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div id="output"></div>
  <script>
    try {
      ${js}
    } catch (error) {
      document.getElementById('output').innerHTML = '<div style="color: red;">Error: ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
  };

  const createMarkdownPreview = (markdown: string): string => {
    // Simple markdown to HTML conversion
    const htmlContent = markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
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
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
    }
    h1, h2, h3 { color: #333; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
  };

  const createReactPreview = async (reactCode: string): Promise<string> => {
    // For now, create a simple React-like preview
    // In a real implementation, you'd use Babel or similar to compile JSX
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
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      ${reactCode.includes('export default') ? reactCode : `
        const App = () => {
          return (
            <div>
              <pre style={{background: '#f5f5f5', padding: '16px', borderRadius: '8px'}}>
                {${JSON.stringify(reactCode)}}
              </pre>
            </div>
          );
        };
      `}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (error) {
      document.getElementById('root').innerHTML = '<div style="color: red; padding: 16px;">Error: ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
  };

  // Debounced compilation
  useEffect(() => {
    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
    }

    compileTimeoutRef.current = setTimeout(() => {
      compileCode(code, language);
    }, 300);

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
    };
  }, [code, language, compileCode]);

  if (!isVisible) {
    return (
      <div className={`flex items-center justify-center bg-[#F5F5F5] ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-sm">Preview hidden</div>
        </div>
      </div>
    );
  }

  if (isCompiling) {
    return (
      <div className={`flex items-center justify-center bg-[#F5F5F5] ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#1F6FEB]" />
          <div className="text-sm text-gray-600">Compiling...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#F5F5F5] ${className}`}>
        <div className="text-center text-red-600 p-4">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <div className="text-sm font-medium mb-1">Compilation Error</div>
          <div className="text-xs">{error}</div>
        </div>
      </div>
    );
  }

  if (!compiledHtml) {
    return (
      <div className={`flex items-center justify-center bg-[#F5F5F5] ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-sm">No code to preview</div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={compiledHtml}
      className={`w-full h-full border-0 bg-white ${className}`}
      title="Live Preview"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
};

export default LivePreviewRenderer;
