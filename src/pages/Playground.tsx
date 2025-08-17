
import { useState } from "react";
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
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MonacoEditor from "@/components/playground/MonacoEditor";
import EditorTabs from "@/components/playground/EditorTabs";
import StatusBar from "@/components/playground/StatusBar";
import EnhancedPreviewPane from "@/components/playground/EnhancedPreviewPane";
import PlaygroundSidebar from "@/components/playground/PlaygroundSidebar";
import WorkflowOverlay from "@/components/playground/WorkflowOverlay";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";

const Playground = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [previewLayoutMode, setPreviewLayoutMode] = useState<'right' | 'bottom' | 'floating'>('right');
  const { isProcessing } = useAIStore();
  const { activeProject } = useProjectStore();

  const handleToggleExecution = () => {
    setIsRunning(!isRunning);
  };

  return (
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
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleExecution}
              disabled={isProcessing}
              className="bg-[#1F6FEB] hover:bg-[#1F6FEB]/90"
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
            <Button variant="ghost" size="sm" className="text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {sidebarOpen && (
          <div className="hidden lg:block w-80 flex-shrink-0">
            <PlaygroundSidebar />
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Tabs */}
          <div className="flex-shrink-0 border-b border-[#21262D]">
            <EditorTabs />
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex overflow-hidden ${previewLayoutMode === 'bottom' ? 'flex-col' : ''}`}>
            {/* Monaco Editor */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 relative">
                <MonacoEditor />
              </div>
              <div className="flex-shrink-0">
                <StatusBar />
              </div>
            </div>

            {/* Enhanced Preview Pane */}
            {previewLayoutMode !== 'floating' && (
              <div className={`flex-shrink-0 ${previewLayoutMode === 'right' ? 'hidden xl:block' : 'block'}`}>
                <EnhancedPreviewPane layoutMode={previewLayoutMode} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Preview Pane */}
      {previewLayoutMode === 'floating' && (
        <EnhancedPreviewPane layoutMode="floating" />
      )}

      {/* Smart Workflow Overlay - Only shows during AI generation */}
      <WorkflowOverlay />
    </div>
  );
};

export default Playground;
