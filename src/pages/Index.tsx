
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Sparkles, 
  Code2
} from "lucide-react";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";
import { aiWorkflowEngine } from "@/services/aiWorkflowEngine";

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();
  const { isProcessing, clearWorkflow } = useAIStore();
  const { activeProject, createProject, setActiveProject, projects } = useProjectStore();

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;

    // Ensure we have an active project
    if (!activeProject) {
      createProject('AI Generated Project', prompt);
      // Get the newly created project (it will be the last one in the array)
      const newProjects = useProjectStore.getState().projects;
      const newProject = newProjects[newProjects.length - 1];
      setActiveProject(newProject);
    }

    // Clear previous workflow
    clearWorkflow();

    // Navigate to playground
    navigate('/playground');

    // Start AI workflow after navigation
    setTimeout(() => {
      aiWorkflowEngine.executeWorkflow(prompt);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Code2 className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
              NovaPilot
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your ideas into production-ready applications with AI
          </p>
        </div>

        {/* Simple Prompt Input */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="text-lg font-semibold mb-4 block">
                What would you like to build today?
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Create a task management app with drag-and-drop functionality, user authentication, and real-time updates..."
                className="min-h-[120px] text-base resize-none"
                disabled={isProcessing}
              />
              <div className="mt-3 text-sm text-muted-foreground">
                Press ⌘⏎ (Ctrl+Enter) to start building
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              size="lg"
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="mr-3 h-5 w-5 animate-spin" />
                  Starting AI Workflow...
                </>
              ) : (
                <>
                  <Send className="mr-3 h-5 w-5" />
                  Start Building
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
