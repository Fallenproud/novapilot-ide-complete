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
  X
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

const AdvancedIDE = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftPanelMode, setLeftPanelMode] = useState<'chat' | 'files'>('chat');
  const [rightPanelMode, setRightPanelMode] = useState<'preview' | 'mini'>('preview');
  
  const { isProcessing } = useAIStore();
  const { activeProject, initializeSampleProjects, projects, setActiveProject } = useProjectStore();
  const { openTab, tabs } = useEditorStore();

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
  }, [leftPanelOpen, rightPanelOpen, bottomPanelOpen]);

  // Advanced File Tree Component
  const AdvancedFileTree = () => (
    <div className="h-full bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-3 border-b border-sidebar-border bg-sidebar-accent">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-sidebar-foreground">Project Explorer</h3>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="New File">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Refresh">
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

  // AI Chat Panel
  const AIChatPanel = () => (
    <div className="h-full bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-3 border-b border-sidebar-border bg-sidebar-accent">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-sidebar-foreground">AI Assistant</h3>
          <MessageSquare className="h-4 w-4 text-sidebar-primary" />
        </div>
      </div>
      <div className="p-3 border-b border-sidebar-border">
        <PromptInput />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatMessages />
      </div>
    </div>
  );

  // Enhanced Live Preview
  const EnhancedPreview = () => (
    <div className="h-full bg-background flex flex-col border-l border-border">
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Live Preview</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Refresh">
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              title="Toggle Size"
              onClick={() => setRightPanelMode(rightPanelMode === 'preview' ? 'mini' : 'preview')}
            >
              {rightPanelMode === 'preview' ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-background p-2">
        <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
          <iframe
            src="data:text/html,<html><body style='margin:0;padding:20px;font-family:system-ui'><h1>Live Preview</h1><p>Your application will render here...</p></body></html>"
            className="w-full h-full border-0"
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );

  // Terminal Panel
  const TerminalPanel = () => (
    <div className="h-full bg-muted/20 border-t border-border">
      <div className="p-2 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Terminal</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => setBottomPanelOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="p-4 h-full bg-card font-mono text-sm overflow-auto">
        <div className="text-muted-foreground mb-2">$ Advanced IDE Terminal v2.0</div>
        <div className="text-primary">$ npm run dev</div>
        <div className="text-muted-foreground">Server running on http://localhost:3000</div>
        <div className="text-primary">$ _</div>
      </div>
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
              <Button variant="outline" size="sm" className="h-7">
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              
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
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main IDE Layout */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel */}
            {leftPanelOpen && (
              <>
                <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                  <Tabs value={leftPanelMode} onValueChange={(value) => setLeftPanelMode(value as any)} className="h-full">
                    <TabsList className="w-full bg-sidebar-accent border-b border-sidebar-border rounded-none">
                      <TabsTrigger value="chat" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        AI Chat
                      </TabsTrigger>
                      <TabsTrigger value="files" className="flex-1">
                        <FileText className="h-4 w-4 mr-1" />
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
                <ResizableHandle />
              </>
            )}

            {/* Center Panel - Editor */}
            <ResizablePanel defaultSize={rightPanelOpen ? 50 : 70} minSize={30}>
              <div className="h-full flex flex-col">
                {/* Editor Tabs */}
                <div className="border-b border-border bg-muted/20">
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
                      <ResizableHandle />
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

            {/* Right Panel - Preview */}
            {rightPanelOpen && (
              <>
                <ResizableHandle />
                <ResizablePanel 
                  defaultSize={rightPanelMode === 'preview' ? 30 : 15} 
                  minSize={rightPanelMode === 'preview' ? 20 : 10}
                  maxSize={50}
                >
                  <EnhancedPreview />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AdvancedIDE;