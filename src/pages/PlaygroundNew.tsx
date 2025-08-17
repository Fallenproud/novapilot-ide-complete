import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Square, 
  Settings, 
  Code2,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Brain,
  Terminal,
  FileText,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const PlaygroundNew = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIntelliSense, setShowIntelliSense] = useState(false);
  const { isProcessing } = useAIStore();
  const { activeProject, initializeSampleProjects, projects, setActiveProject } = useProjectStore();
  const { openTab } = useEditorStore();

  // Initialize sample projects
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

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + \: Toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
        event.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
      
      // Ctrl/Cmd + Shift + I: Toggle IntelliSense
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        setShowIntelliSense(!showIntelliSense);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, showIntelliSense]);

  // Simple Live Preview Component
  const LivePreview = () => (
    <div className="h-full bg-background border-l border-border flex flex-col">
      <div className="p-3 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Play className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-background">
        <iframe
          src="/preview"
          className="w-full h-full border-0"
          title="Live Preview"
        />
      </div>
    </div>
  );

  // Sidebar Component
  const Sidebar = () => (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* AI Chat Section */}
      <div className="flex-shrink-0 border-b border-sidebar-border p-4">
        <PromptInput />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-3 bg-sidebar-accent border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-sidebar-primary" />
            <h3 className="text-sm font-medium text-sidebar-foreground">AI Chat</h3>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatMessages />
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="h-64 border-t border-sidebar-border flex-shrink-0">
        <Tabs defaultValue="files" className="h-full flex flex-col">
          <TabsList className="w-full bg-sidebar-accent border-b border-sidebar-border rounded-none flex-shrink-0">
            <TabsTrigger value="files" className="flex-1 data-[state=active]:bg-sidebar">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
            <TabsTrigger value="terminal" className="flex-1 data-[state=active]:bg-sidebar">
              <Terminal className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Terminal</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="flex-1 m-0 overflow-hidden">
            <FileExplorerEnhanced />
          </TabsContent>
          
          <TabsContent value="terminal" className="flex-1 m-0 p-4 overflow-hidden">
            <div className="h-full bg-muted rounded font-mono text-sm text-muted-foreground p-3 overflow-auto">
              <div className="text-muted-foreground mb-2">Terminal v1.0.0</div>
              <div className="text-primary">$ Ready for commands...</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  return (
    <CodeIntelligenceProvider>
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-card px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Projects</span>
              </Button>

              {/* Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
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
                <Code2 className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Playground IDE</h1>
              </div>
              
              {activeProject && (
                <div className="hidden sm:block text-sm text-muted-foreground">
                  <span className="text-foreground">{activeProject.name}</span>
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
                title="Toggle IntelliSense (Ctrl+Shift+I)"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Intelligence</span>
              </Button>

              {/* Run Button */}
              <Button
                variant={isRunning ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleExecution}
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90"
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
              
              {/* Settings */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          {sidebarOpen && (
            <div className="w-80 flex-shrink-0">
              <Sidebar />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Section */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Editor Tabs */}
              <div className="flex-shrink-0 border-b border-border">
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

              {/* IntelliSense Panel */}
              {showIntelliSense && (
                <div className="border-t border-border">
                  <IntelliSensePanel
                    isVisible={showIntelliSense}
                    onToggle={() => setShowIntelliSense(false)}
                    className="h-80"
                  />
                </div>
              )}
            </div>

            {/* Live Preview Section */}
            <div className="w-96 flex-shrink-0">
              <LivePreview />
            </div>
          </div>
        </div>
      </div>
    </CodeIntelligenceProvider>
  );
};

export default PlaygroundNew;