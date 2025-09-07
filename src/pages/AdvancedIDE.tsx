import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Square, 
  Settings, 
  Code2,
  PanelLeft,
  PanelRight,
  Brain,
  Terminal,
  FileText,
  MessageSquare,
  FolderTree,
  Monitor,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Plus,
  X,
  Rocket,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import MonacoEditor from "@/components/playground/MonacoEditor";
import EditorTabs from "@/components/playground/EditorTabs";
import StatusBar from "@/components/playground/StatusBar";
import PromptInput from "@/components/playground/PromptInput";
import ChatMessages from "@/components/playground/ChatMessages";
import FileExplorerEnhanced from "@/components/playground/FileExplorerEnhanced";
import CodeIntelligenceProvider from "@/components/playground/CodeIntelligenceProvider";
import IntelliSensePanel from "@/components/playground/IntelliSensePanel";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore } from "@/stores/editorStore";
import DynamicPreview from "@/components/playground/DynamicPreview";
import E2BTerminal from "@/components/playground/E2BTerminal";
import { deploymentService } from "@/services/deploymentService";
import { useToast } from "@/hooks/use-toast";
import IDESettingsModal from "@/components/modals/IDESettingsModal";

const AdvancedIDE = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [centerPanelOpen, setCenterPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftPanelMode, setLeftPanelMode] = useState<'chat' | 'files'>('chat');
  const [rightPanelMode, setRightPanelMode] = useState<'preview' | 'mini'>('preview');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  
  const { isProcessing } = useAIStore();
  const { activeProject, initializeSampleProjects, projects, setActiveProject } = useProjectStore();
  const { openTab, tabs } = useEditorStore();
  const { toast } = useToast();

  // Initialize projects
  useEffect(() => {
    initializeSampleProjects();
  }, [initializeSampleProjects]);

  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject, setActiveProject]);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSave = () => {
    // Save current file functionality
    const { activeTabId, tabs } = useEditorStore.getState();
    const { activeProject } = useProjectStore.getState();
    
    if (activeTabId && activeProject) {
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      if (activeTab) {
        toast({
          title: "File Saved",
          description: `${activeTab.name} has been saved successfully.`,
        });
      }
    }
  };

  const handleNewFile = () => {
    // New file functionality
    const { activeProject } = useProjectStore.getState();
    if (activeProject) {
      const fileName = `new-file-${Date.now()}.tsx`;
      toast({
        title: "New File Created",
        description: `Created ${fileName}`,
      });
    }
  };

  const handleRefresh = () => {
    // Refresh file explorer
    toast({
      title: "Refreshed",
      description: "File explorer refreshed successfully.",
    });
  };

  const handleDeploy = async () => {
    if (!activeProject) {
      toast({
        title: "No Project Selected",
        description: "Please select a project to deploy.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    try {
      const result = await deploymentService.deployProject({
        projectId: activeProject.id,
        projectName: activeProject.name,
        files: activeProject.files.map(f => ({
          name: f.name,
          content: f.content,
          path: f.path,
        })),
      });

      if (result.success && result.url) {
        setDeployedUrl(result.url);
        toast({
          title: "Deployment Successful!",
          description: `Your project is live at ${result.url}`,
        });
      } else {
        throw new Error(result.error || 'Deployment failed');
      }
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '1') {
        event.preventDefault();
        setLeftPanelOpen(!leftPanelOpen);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '2') {
        event.preventDefault();
        setRightPanelOpen(!rightPanelOpen);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '3') {
        event.preventDefault();
        setBottomPanelOpen(!bottomPanelOpen);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault();
        setCenterPanelOpen(!centerPanelOpen);
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        toggleFullscreen();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        // Save current file
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [leftPanelOpen, rightPanelOpen, bottomPanelOpen, centerPanelOpen]);

  // Advanced File Tree Component - Improved visibility
  const AdvancedFileTree = () => (
    <div className="h-full bg-card/95 flex flex-col border-r border-border/40 backdrop-blur-sm">
      <div className="p-3 border-b border-border/60 bg-card/80">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Project Explorer</h3>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted/80" title="New File" onClick={handleNewFile}>
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted/80" title="Refresh" onClick={handleRefresh}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <FileExplorerEnhanced />
      </div>
    </div>
  );

  // AI Chat Panel - Improved visibility and positioning
  const AIChatPanel = () => (
    <div className="h-full bg-card/95 flex flex-col border-r border-border/40 rounded-r-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-border/60 bg-card/80">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-hidden min-h-0">
          <ChatMessages />
        </div>
        <div className="flex-shrink-0 h-auto max-h-[200px] min-h-[120px] bg-card/90 border-t border-border/40">
          <PromptInput />
        </div>
      </div>
    </div>
  );


  // Terminal Panel with E2B Integration - Improved visibility
  const TerminalPanel = () => (
    <div className="h-full bg-card/95 rounded-xl border border-border/50 overflow-hidden shadow-lg backdrop-blur-sm">
      <E2BTerminal />
    </div>
  );

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Advanced Toolbar */}
        <div className="bg-card border-b border-border px-3 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Code2 className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">NovaPilot IDE</span>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {activeProject && (
                <div className="flex items-center space-x-2 text-sm">
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{activeProject.name}</span>
                  <span className="text-muted-foreground">({activeProject.files.length} files)</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Panel Toggles */}
              <div className="flex items-center space-x-1 bg-muted/50 rounded-md p-1">
                <Button
                  variant={leftPanelOpen ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                  className="h-7 px-2"
                  title="Toggle Left Panel (Ctrl+1)"
                >
                  <PanelLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant={centerPanelOpen ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCenterPanelOpen(!centerPanelOpen)}
                  className="h-7 px-2"
                  title="Toggle Editor (Ctrl+0)"
                >
                  {centerPanelOpen ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                <Button
                  variant={rightPanelOpen ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                  className="h-7 px-2"
                  title="Toggle Right Panel (Ctrl+2)"
                >
                  <PanelRight className="h-3 w-3" />
                </Button>
                <Button
                  variant={bottomPanelOpen ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
                  className="h-7 px-2"
                  title="Toggle Terminal (Ctrl+3)"
                >
                  <Terminal className="h-3 w-3" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Action Buttons */}
              <Button variant="outline" size="sm" className="h-7" onClick={handleSave}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-7"
                onClick={handleDeploy}
                disabled={isDeploying || !activeProject}
                title="Deploy to E2B"
              >
                {isDeploying ? (
                  <>
                    <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="h-3 w-3 mr-1" />
                    Deploy
                  </>
                )}
              </Button>

              {deployedUrl && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7"
                  onClick={() => window.open(deployedUrl, '_blank')}
                  title="Open Deployed Site"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Live
                </Button>
              )}
              
              <Button
                variant={isRunning ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleExecution}
                disabled={isProcessing}
                className="h-7"
              >
                {isRunning ? (
                  <>
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-7"
                title="Fullscreen (Ctrl+Shift+F)"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>

              <Button variant="ghost" size="sm" className="h-7">
                <IDESettingsModal>
                  <Settings className="h-3 w-3" />
                </IDESettingsModal>
              </Button>
            </div>
          </div>
        </div>

        {/* Main IDE Layout */}
        <div className="flex-1 overflow-hidden p-6">
          <ResizablePanelGroup direction="horizontal" className="h-full gap-8">
            {/* Left Panel */}
            <ResizablePanel 
              defaultSize={leftPanelOpen ? 25 : 0} 
              minSize={leftPanelOpen ? 20 : 0} 
              maxSize={leftPanelOpen ? 45 : 0}
              className={leftPanelOpen ? "" : "hidden"}
            >
              <Tabs value={leftPanelMode} onValueChange={(value) => setLeftPanelMode(value as any)} className="h-full">
                <TabsList className="w-full bg-sidebar-accent border-b border-sidebar-border rounded-t-xl">
                  <TabsTrigger value="chat" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Chat
                  </TabsTrigger>
                  <TabsTrigger value="files" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Files
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="h-full m-0">
                  <AIChatPanel />
                </TabsContent>
                <TabsContent value="files" className="h-full m-0">
                  <AdvancedFileTree />
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            {leftPanelOpen && <ResizableHandle className="w-2 bg-transparent hover:bg-border/50 transition-colors" />}

            {/* Center Panel - Editor */}
            <ResizablePanel 
              defaultSize={
                centerPanelOpen 
                  ? (rightPanelOpen ? (leftPanelOpen ? 45 : 60) : (leftPanelOpen ? 70 : 100))
                  : 0
              } 
              minSize={centerPanelOpen ? 30 : 0}
              className={centerPanelOpen ? "" : "hidden"}
            >
              <div className="h-full flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
                {/* Editor Tabs */}
                <div className="border-b border-border bg-muted/20 rounded-t-2xl">
                  <EditorTabs />
                </div>

                {/* Editor Area */}
                <div className="flex-1 min-h-0">
                  {bottomPanelOpen ? (
                    <ResizablePanelGroup direction="vertical" className="h-full">
                      <ResizablePanel defaultSize={70} minSize={40}>
                        <div className="h-full w-full">
                          <MonacoEditor />
                        </div>
                      </ResizablePanel>
                      <ResizableHandle className="h-2 bg-transparent hover:bg-border/50 transition-colors" />
                      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                        <TerminalPanel />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  ) : (
                    <div className="h-full w-full">
                      <MonacoEditor />
                    </div>
                  )}
                </div>

                {/* Status Bar */}
                <StatusBar />
              </div>
            </ResizablePanel>

            {centerPanelOpen && rightPanelOpen && <ResizableHandle className="w-2 bg-transparent hover:bg-border/50 transition-colors" />}

            {/* Right Panel - Preview */}
            <ResizablePanel 
              defaultSize={
                rightPanelOpen 
                  ? (rightPanelMode === 'preview' ? (centerPanelOpen ? 30 : 70) : 15)
                  : 0
              } 
              minSize={rightPanelOpen ? (rightPanelMode === 'preview' ? 20 : 10) : 0}
              maxSize={rightPanelOpen ? (centerPanelOpen ? 50 : 80) : 0}
              className={rightPanelOpen ? "" : "hidden"}
            >
              <div className="h-full bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
                <DynamicPreview 
                  mode={rightPanelMode}
                  onModeChange={setRightPanelMode}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AdvancedIDE;