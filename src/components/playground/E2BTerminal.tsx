import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Terminal, 
  Play, 
  Square, 
  Trash2, 
  WifiOff, 
  Wifi,
  Package,
  FileText,
  Activity
} from 'lucide-react';
import { useE2BSession } from '@/hooks/useE2BSession';
import { useProjectStore } from '@/stores/projectStore';

interface E2BTerminalProps {
  className?: string;
}

const E2BTerminal: React.FC<E2BTerminalProps> = ({ className = '' }) => {
  const { activeProject } = useProjectStore();
  const {
    session,
    isConnected,
    isExecuting,
    logs,
    output,
    error,
    createSession,
    executeCode,
    updateFiles,
    installPackages,
    closeSession,
    clearOutput
  } = useE2BSession(activeProject?.id || 'default');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, output]);

  const handleCreateSession = async () => {
    try {
      await createSession('node');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleExecuteCode = async () => {
    if (!activeProject?.files?.length) return;
    
    // Find main file to execute
    const mainFile = activeProject.files.find(f => 
      f.name === 'index.js' || f.name === 'main.js' || f.name === 'app.js'
    ) || activeProject.files[0];

    if (mainFile) {
      try {
        await executeCode(mainFile.content, 'javascript');
      } catch (error) {
        console.error('Execution failed:', error);
      }
    }
  };

  const handleInstallPackages = async () => {
    try {
      await installPackages(['express', 'lodash', 'axios']);
    } catch (error) {
      console.error('Package installation failed:', error);
    }
  };

  const handleSyncFiles = async () => {
    if (!activeProject?.files?.length) return;

    const changes = activeProject.files.map(file => ({
      path: file.name,
      content: file.content,
      action: 'update' as const
    }));

    try {
      await updateFiles(changes);
    } catch (error) {
      console.error('File sync failed:', error);
    }
  };

  const formatLogEntry = (log: string, index: number) => {
    const timestamp = new Date().toLocaleTimeString();
    
    if (log.startsWith('[ERROR]')) {
      return (
        <div key={index} className="flex items-start space-x-2 text-red-400 font-mono text-sm">
          <span className="text-red-500 text-xs">{timestamp}</span>
          <span className="flex-1">{log}</span>
        </div>
      );
    }
    
    if (log.startsWith('[OUTPUT]')) {
      return (
        <div key={index} className="flex items-start space-x-2 text-green-400 font-mono text-sm">
          <span className="text-muted-foreground text-xs">{timestamp}</span>
          <span className="flex-1">{log}</span>
        </div>
      );
    }
    
    if (log.startsWith('[SYSTEM]')) {
      return (
        <div key={index} className="flex items-start space-x-2 text-blue-400 font-mono text-sm">
          <span className="text-muted-foreground text-xs">{timestamp}</span>
          <span className="flex-1">{log}</span>
        </div>
      );
    }
    
    return (
      <div key={index} className="flex items-start space-x-2 text-foreground font-mono text-sm">
        <span className="text-muted-foreground text-xs">{timestamp}</span>
        <span className="flex-1">{log}</span>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col bg-gradient-to-br from-card/95 to-card/80 rounded-xl border border-border/60 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/60 bg-gradient-to-r from-muted/30 to-muted/20 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">E2B Terminal</span>
          <Badge 
            variant={isConnected ? "default" : "secondary"} 
            className={`text-xs ${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
          {session && (
            <Badge variant="outline" className="text-xs">
              {session.id.substring(0, 8)}...
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!isConnected ? (
            <Button
              onClick={handleCreateSession}
              size="sm"
              variant="default"
              className="h-8"
            >
              <Activity className="h-4 w-4 mr-1" />
              Connect
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSyncFiles}
                size="sm"
                variant="outline"
                className="h-8"
                disabled={isExecuting}
              >
                <FileText className="h-4 w-4 mr-1" />
                Sync Files
              </Button>
              
              <Button
                onClick={handleInstallPackages}
                size="sm"
                variant="outline"
                className="h-8"
                disabled={isExecuting}
              >
                <Package className="h-4 w-4 mr-1" />
                Install
              </Button>
              
              <Button
                onClick={handleExecuteCode}
                size="sm"
                variant={isExecuting ? "destructive" : "default"}
                className="h-8"
                disabled={!activeProject?.files?.length}
              >
                {isExecuting ? (
                  <>
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </>
                )}
              </Button>
            </>
          )}
          
          <Button
            onClick={clearOutput}
            size="sm"
            variant="ghost"
            className="h-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="p-4 space-y-2 font-mono text-sm">
            {!isConnected && logs.length === 0 && (
              <div className="text-muted-foreground text-center py-8">
                <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "Connect" to start an E2B session</p>
                <p className="text-xs mt-2">Real-time code execution with WebSocket streaming</p>
              </div>
            )}
            
            {logs.map((log, index) => formatLogEntry(log, index))}
            
            {output && (
              <div className="mt-4 p-3 bg-card/50 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground mb-2">Output:</div>
                <pre className="text-green-400 whitespace-pre-wrap text-sm">{output}</pre>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                <div className="text-xs text-destructive mb-2">Error:</div>
                <pre className="text-destructive whitespace-pre-wrap text-sm">{error}</pre>
              </div>
            )}
            
            {isExecuting && (
              <div className="flex items-center space-x-2 text-primary animate-pulse">
                <Activity className="h-4 w-4" />
                <span>Executing code...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default E2BTerminal;