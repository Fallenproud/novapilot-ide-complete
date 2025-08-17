import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Play, 
  Square, 
  Settings, 
  Code2,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MonacoEditor from "@/components/playground/MonacoEditor";
import EditorTabs from "@/components/playground/EditorTabs";
import StatusBar from "@/components/playground/StatusBar";
import EnhancedPreviewPane from "@/components/playground/EnhancedPreviewPane";
import PlaygroundSidebar from "@/components/playground/PlaygroundSidebar";
import CodeIntelligenceProvider from "@/components/playground/CodeIntelligenceProvider";
import IntelliSensePanel from "@/components/playground/IntelliSensePanel";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore } from "@/stores/editorStore";

const Playground = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [previewLayoutMode, setPreviewLayoutMode] = useState<'right' | 'bottom' | 'floating'>('right');
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [showIntelliSense, setShowIntelliSense] = useState(false);
  const { isProcessing } = useAIStore();
  const { activeProject, initializeSampleProjects, projects, setActiveProject } = useProjectStore();
  const { openTab } = useEditorStore();

  // Initialize sample projects and set active project
  useEffect(() => {
    initializeSampleProjects();
  }, [initializeSampleProjects]);

  // Set active project when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject, setActiveProject]);

  // Auto-open first file when active project changes
  useEffect(() => {
    if (activeProject && activeProject.files.length > 0) {
      const firstFile = activeProject.files[0];
      openTab({
        id: firstFile.id,
        name: firstFile.name,
        path: firstFile.path,
        language: firstFile.language,
        fileId: firstFile.id
      });
    }
  }, [activeProject, openTab]);

  const handleToggleExecution = () => {
    setIsRunning(!isRunning);
  };

  // Enhanced keyboard shortcuts for playground
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K: Toggle keyboard hints
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowKeyboardHints(!showKeyboardHints);
      }
      
      // Ctrl/Cmd + \: Toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
        event.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
      
      // Ctrl/Cmd + Shift + E: Focus file explorer
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setSidebarOpen(true);
      }

      // Ctrl/Cmd + Shift + I: Toggle IntelliSense
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        setShowIntelliSense(!showIntelliSense);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardHints, sidebarOpen, showIntelliSense]);

  return (
    <CodeIntelligenceProvider>
      <div className="h-screen bg-[#0D1117] text-[#F0F6FC] flex flex-col overflow-hidden">
        {/* Playground Header */}
        <div className="border-b border-[#21262D] bg-[#161B22] px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back to Projects Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Projects</span>
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-[#161B22]">
                  <PlaygroundSidebar />
                </SheetContent>
              </Sheet>

              {/* Desktop Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Toggle Sidebar (Ctrl+\)"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <Code2 className="h-5 w-5 text-[#1F6FEB]" />
                <h1 className="text-lg font-semibold">Playground</h1>
              </div>
              
              {activeProject && (
                <div className="hidden sm:block text-sm text-[#8B949E]">
                  <span className="text-[#F0F6FC]">{activeProject.name}</span>
                  <span className="ml-2 text-xs">
                    {activeProject.files.length} file{activeProject.files.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* IntelliSense Toggle */}
              <Button
                variant={showIntelliSense ? "default" : "outline"}
                size="sm"
                onClick={() => setShowIntelliSense(!showIntelliSense)}
                className="bg-background/80 backdrop-blur-sm"
                title="Toggle IntelliSense (Ctrl+Shift+I)"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Intelligence</span>
              </Button>

              <Button
                variant={isRunning ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleExecution}
                disabled={isProcessing}
                className="bg-[#1F6FEB] hover:bg-[#1F6FEB]/90"
                title="Run Code (F5)"
              >
                {isRunning ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Run</span>
                  </>
                )}
              </Button>
              
              {/* Keyboard shortcuts hint */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                onClick={() => setShowKeyboardHints(!showKeyboardHints)}
                title="Keyboard Shortcuts (Ctrl+K)"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Keyboard Shortcuts Overlay */}
        {showKeyboardHints && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Toggle Sidebar</span>
                  <code className="bg-[#21262D] px-2 py-1 rounded">Ctrl+\</code>
                </div>
                <div className="flex justify-between">
                  <span>Toggle IntelliSense</span>
                  <code className="bg-[#21262D] px-2 py-1 rounded">Ctrl+Shift+I</code>
                </div>
                <div className="flex justify-between">
                  <span>Toggle Preview</span>
                  <code className="bg-[#21262D] px-2 py-1 rounded">Ctrl+Shift+P</code>
                </div>
                <div className="flex justify-between">
                  <span>Fullscreen Preview</span>
                  <code className="bg-[#21262D] px-2 py-1 rounded">Ctrl+Shift+F</code>
                </div>
                <div className="flex justify-between">
                  <span>Refresh Preview</span>
                  <code className="bg-[#21262D] px-2 py-1 rounded">Ctrl+Shift+R</code>
                </div>
                <div className="flex justify-between">
                  <span>Focus Explorer</span>
                  <code className="bg-[#21262D] px-2 py-1 rounded">Ctrl+Shift+E</code>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setShowKeyboardHints(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Main Layout - Clean 2-Pane IDE */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Pane: AI Chat + File Explorer + Terminal */}
          {sidebarOpen && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <PlaygroundSidebar />
            </div>
          )}

          {/* Right Pane: Editor + Live Preview */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Section */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Editor Tabs */}
              <div className="flex-shrink-0 border-b border-[#21262D]">
                <EditorTabs />
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 relative">
                <MonacoEditor />
              </div>

              {/* Status Bar */}
              <div className="flex-shrink-0">
                <StatusBar />
              </div>

              {/* IntelliSense Panel - Bottom */}
              {showIntelliSense && (
                <div className="border-t border-[#21262D]">
                  <IntelliSensePanel
                    isVisible={showIntelliSense}
                    onToggle={() => setShowIntelliSense(false)}
                    className="h-80"
                  />
                </div>
              )}
            </div>

            {/* Live Preview Section */}
            <div className="w-96 border-l border-[#21262D] flex-shrink-0">
              <EnhancedPreviewPane />
            </div>
          </div>
        </div>
      </div>
    </CodeIntelligenceProvider>
  );
};

export default Playground;
