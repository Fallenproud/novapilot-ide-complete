
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bug, 
  Activity, 
  Trash2, 
  Download, 
  Terminal,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { ConsoleMessage, PerformanceMetric } from '@/services/lovable/devtools';

interface DevToolsPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

const DevToolsPanel: React.FC<DevToolsPanelProps> = ({
  isVisible,
  onToggle,
  className = ""
}) => {
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [activeTab, setActiveTab] = useState('console');

  useEffect(() => {
    const handleConsoleEvent = (event: CustomEvent<ConsoleMessage>) => {
      setConsoleMessages(prev => [...prev, event.detail]);
    };

    const handlePerformanceEvent = (event: CustomEvent<PerformanceMetric>) => {
      setPerformanceMetrics(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(m => m.name === event.detail.name);
        
        if (existingIndex >= 0) {
          updated[existingIndex] = event.detail;
        } else {
          updated.push(event.detail);
        }
        
        return updated;
      });
    };

    const handleConsoleClear = () => {
      setConsoleMessages([]);
    };

    window.addEventListener('devtools:console', handleConsoleEvent as EventListener);
    window.addEventListener('devtools:performance', handlePerformanceEvent as EventListener);
    window.addEventListener('devtools:console-cleared', handleConsoleClear);

    return () => {
      window.removeEventListener('devtools:console', handleConsoleEvent as EventListener);
      window.removeEventListener('devtools:performance', handlePerformanceEvent as EventListener);
      window.removeEventListener('devtools:console-cleared', handleConsoleClear);
    };
  }, []);

  const getConsoleIcon = (level: ConsoleMessage['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Terminal className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatConsoleArgs = (args: any[]): string => {
    return args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatMetricValue = (value: number, unit: string): string => {
    if (unit === 'MB') {
      return `${value.toFixed(2)} ${unit}`;
    } else if (unit === 'ms') {
      return `${Math.round(value)} ${unit}`;
    }
    return `${value} ${unit}`;
  };

  const handleClearConsole = () => {
    setConsoleMessages([]);
  };

  const handleExportLogs = () => {
    const data = {
      console: consoleMessages,
      performance: performanceMetrics,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lovable-devtools-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`bg-[#161B22] border-t border-[#21262D] ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#21262D]">
        <div className="flex items-center space-x-2">
          <Bug className="h-4 w-4 text-[#1F6FEB]" />
          <span className="text-sm font-medium text-[#F0F6FC]">DevTools</span>
          {consoleMessages.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {consoleMessages.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearConsole}
            className="text-[#8B949E] hover:text-[#F0F6FC]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportLogs}
            className="text-[#8B949E] hover:text-[#F0F6FC]"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-[#8B949E] hover:text-[#F0F6FC]"
          >
            ×
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#161B22]">
          <TabsTrigger value="console" className="data-[state=active]:bg-[#21262D]">
            <Terminal className="h-4 w-4 mr-2" />
            Console
            {consoleMessages.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {consoleMessages.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-[#21262D]">
            <Activity className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="mt-0 h-full">
          <ScrollArea className="h-[200px]">
            <div className="p-2 space-y-1">
              {consoleMessages.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-[#8B949E] text-sm">
                  No console messages
                </div>
              ) : (
                consoleMessages.map(message => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-2 p-2 rounded text-xs font-mono hover:bg-[#21262D]"
                  >
                    {getConsoleIcon(message.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[#8B949E]">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {message.source && (
                          <span className="text-[#6E7681] text-xs truncate">
                            {message.source}
                          </span>
                        )}
                      </div>
                      <div 
                        className={`whitespace-pre-wrap break-words ${
                          message.level === 'error' ? 'text-red-400' :
                          message.level === 'warn' ? 'text-yellow-400' :
                          'text-[#F0F6FC]'
                        }`}
                      >
                        {formatConsoleArgs(message.args)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="performance" className="mt-0 h-full">
          <ScrollArea className="h-[200px]">
            <div className="p-2 space-y-2">
              {performanceMetrics.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-[#8B949E] text-sm">
                  No performance data
                </div>
              ) : (
                performanceMetrics.map((metric, index) => (
                  <div
                    key={`${metric.name}-${index}`}
                    className="flex items-center justify-between p-2 bg-[#0D1117] rounded text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-[#1F6FEB]" />
                      <span className="text-[#F0F6FC]">{metric.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[#79C0FF]">
                        {formatMetricValue(metric.value, metric.unit)}
                      </span>
                      <span className="text-[#8B949E] text-xs">
                        {formatTimestamp(metric.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevToolsPanel;
