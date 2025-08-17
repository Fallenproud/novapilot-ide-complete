
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Search, 
  FileCode, 
  AlertTriangle,
  Info,
  Lightbulb,
  RefreshCw,
  X
} from 'lucide-react';
import { useCodeIntelligence } from './CodeIntelligenceProvider';
import { useProjectStore } from '@/stores/projectStore';
import { Diagnostic, SymbolInformation, DiagnosticSeverity } from '@/services/lovable/codeIntelligence';

interface IntelliSensePanelProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

const IntelliSensePanel: React.FC<IntelliSensePanelProps> = ({
  isVisible,
  onToggle,
  className = ""
}) => {
  const { engine } = useCodeIntelligence();
  const { activeFile, allFiles } = useProjectStore();
  const [diagnostics, setDiagnostics] = useState<{ [filePath: string]: Diagnostic[] }>({});
  const [symbols, setSymbols] = useState<SymbolInformation[]>([]);
  const [activeTab, setActiveTab] = useState('diagnostics');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (engine && allFiles.length > 0) {
      analyzeSources();
    }
  }, [engine, allFiles]);

  const analyzeSources = async () => {
    if (!engine) return;

    setIsAnalyzing(true);
    const newDiagnostics: { [filePath: string]: Diagnostic[] } = {};
    const allSymbols: SymbolInformation[] = [];

    try {
      // Analyze each file for diagnostics
      for (const file of allFiles) {
        if (file.language === 'typescript' || file.language === 'javascript' || 
            file.language === 'tsx' || file.language === 'jsx') {
          const fileDiagnostics = await engine.getDiagnostics(file.path);
          if (fileDiagnostics.length > 0) {
            newDiagnostics[file.path] = fileDiagnostics;
          }

          // Get symbols from each file
          const fileSymbols = engine.getDocumentSymbols(file.path);
          allSymbols.push(...fileSymbols);
        }
      }

      setDiagnostics(newDiagnostics);
      setSymbols(allSymbols);
    } catch (error) {
      console.error('Error analyzing sources:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDiagnosticIcon = (severity: DiagnosticSeverity) => {
    switch (severity) {
      case DiagnosticSeverity.Error:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case DiagnosticSeverity.Warning:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case DiagnosticSeverity.Information:
        return <Info className="h-4 w-4 text-blue-500" />;
      case DiagnosticSeverity.Hint:
        return <Lightbulb className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityText = (severity: DiagnosticSeverity) => {
    switch (severity) {
      case DiagnosticSeverity.Error:
        return 'Error';
      case DiagnosticSeverity.Warning:
        return 'Warning';
      case DiagnosticSeverity.Information:
        return 'Info';
      case DiagnosticSeverity.Hint:
        return 'Hint';
      default:
        return 'Unknown';
    }
  };

  const getSymbolIcon = (kind: number) => {
    // Simple mapping - could be expanded
    return <FileCode className="h-4 w-4 text-blue-500" />;
  };

  const totalDiagnostics = Object.values(diagnostics).reduce((sum, diags) => sum + diags.length, 0);
  const errorCount = Object.values(diagnostics).reduce((sum, diags) => 
    sum + diags.filter(d => d.severity === DiagnosticSeverity.Error).length, 0);
  const warningCount = Object.values(diagnostics).reduce((sum, diags) => 
    sum + diags.filter(d => d.severity === DiagnosticSeverity.Warning).length, 0);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className={`bg-[#161B22] border-[#21262D] ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-[#1F6FEB]" />
          <CardTitle className="text-sm font-medium text-[#F0F6FC]">
            Code Intelligence
          </CardTitle>
          {totalDiagnostics > 0 && (
            <Badge variant="secondary" className="text-xs">
              {totalDiagnostics}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeSources}
            disabled={isAnalyzing}
            className="text-[#8B949E] hover:text-[#F0F6FC]"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-[#8B949E] hover:text-[#F0F6FC]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-[#161B22]">
            <TabsTrigger value="diagnostics" className="data-[state=active]:bg-[#21262D]">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Problems
              {totalDiagnostics > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {totalDiagnostics}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="symbols" className="data-[state=active]:bg-[#21262D]">
              <FileCode className="h-4 w-4 mr-2" />
              Symbols
              {symbols.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {symbols.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-2">
                {totalDiagnostics === 0 ? (
                  <div className="flex items-center justify-center h-20 text-[#8B949E] text-sm">
                    {isAnalyzing ? 'Analyzing code...' : 'No problems found'}
                  </div>
                ) : (
                  <>
                    {/* Summary */}
                    <div className="flex items-center space-x-4 p-2 bg-[#0D1117] rounded text-sm">
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-[#F0F6FC]">{errorCount} errors</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-[#F0F6FC]">{warningCount} warnings</span>
                      </div>
                    </div>

                    {/* Diagnostics by file */}
                    {Object.entries(diagnostics).map(([filePath, fileDiagnostics]) => (
                      <div key={filePath} className="space-y-1">
                        <div className="text-xs text-[#8B949E] font-medium px-2">
                          {filePath.split('/').pop()}
                        </div>
                        {fileDiagnostics.map((diagnostic, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 p-2 rounded text-xs hover:bg-[#21262D] cursor-pointer"
                          >
                            {getDiagnosticIcon(diagnostic.severity)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {getSeverityText(diagnostic.severity)}
                                </Badge>
                                <span className="text-[#8B949E]">
                                  Line {diagnostic.range.start.line + 1}
                                </span>
                                {diagnostic.code && (
                                  <span className="text-[#6E7681] text-xs">
                                    ({diagnostic.code})
                                  </span>
                                )}
                              </div>
                              <div className="text-[#F0F6FC] break-words">
                                {diagnostic.message}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="symbols" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {symbols.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-[#8B949E] text-sm">
                    {isAnalyzing ? 'Analyzing symbols...' : 'No symbols found'}
                  </div>
                ) : (
                  symbols.map((symbol, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 rounded text-sm hover:bg-[#21262D] cursor-pointer"
                    >
                      {getSymbolIcon(symbol.kind)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[#F0F6FC] font-medium">{symbol.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {symbol.kind === 12 ? 'Function' : 
                             symbol.kind === 5 ? 'Class' : 
                             symbol.kind === 11 ? 'Interface' : 'Symbol'}
                          </Badge>
                        </div>
                        <div className="text-[#8B949E] text-xs">
                          {symbol.location.uri.split('/').pop()} • Line {symbol.location.range.start.line + 1}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntelliSensePanel;
