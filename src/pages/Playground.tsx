import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Square, 
  Settings, 
  FileText, 
  Terminal, 
  Code2
} from "lucide-react";
import PromptInput from "@/components/playground/PromptInput";
import WorkflowStepper from "@/components/playground/WorkflowStepper";
import FileExplorerEnhanced from "@/components/playground/FileExplorerEnhanced";
import MonacoEditor from "@/components/playground/MonacoEditor";
import EditorTabs from "@/components/playground/EditorTabs";
import StatusBar from "@/components/playground/StatusBar";
import PreviewPane from "@/components/playground/PreviewPane";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";
import ChatMessages from "@/components/playground/ChatMessages";

const Playground = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { currentStep, isProcessing } = useAIStore();
  const { activeProject } = useProjectStore();

  const handleToggleExecution = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC]">
      {/* Header */}
      <div className="border-b border-[#21262D] bg-[#161B22] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-[#1F6FEB]" />
              <h1 className="text-xl font-semibold">NovaPilot Playground</h1>
            </div>
            {activeProject && (
              <div className="text-sm text-[#8B949E]">
                Project: <span className="text-[#F0F6FC]">{activeProject.name}</span>
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
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-[#21262D] bg-[#161B22] flex flex-col">
          {/* Prompt Input */}
          <div className="p-4 border-b border-[#21262D]">
            <PromptInput />
          </div>

          {/* Workflow Stepper */}
          <div className="p-4 border-b border-[#21262D]">
            <WorkflowStepper />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col border-b border-[#21262D]">
            <div className="p-3 bg-[#21262D]">
              <h3 className="text-sm font-medium text-[#F0F6FC]">AI Chat</h3>
            </div>
            <ChatMessages />
          </div>

          {/* File Explorer & Terminal */}
          <div className="h-64 overflow-hidden">
            <Tabs defaultValue="files" className="h-full flex flex-col">
              <TabsList className="w-full bg-[#21262D] border-b border-[#21262D] rounded-none">
                <TabsTrigger value="files" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="terminal" className="flex-1">
                  <Terminal className="mr-2 h-4 w-4" />
                  Terminal
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="files" className="flex-1 m-0">
                <FileExplorerEnhanced />
              </TabsContent>
              
              <TabsContent value="terminal" className="flex-1 m-0 p-4">
                <div className="h-full bg-black rounded font-mono text-sm text-green-400 p-3">
                  <div className="text-[#8B949E] mb-2">NovaPilot Terminal v1.0.0</div>
                  <div className="text-green-400">$ Ready for commands...</div>
                  {isRunning && (
                    <div className="text-blue-400 animate-pulse">
                      $ Building project...
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <EditorTabs />

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <MonacoEditor />
          </div>

          {/* Status Bar */}
          <StatusBar />
        </div>

        {/* Right Panel - Preview */}
        <PreviewPane />
      </div>
    </div>
  );
};

export default Playground;
