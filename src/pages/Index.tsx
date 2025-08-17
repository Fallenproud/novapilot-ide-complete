
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Sparkles, 
  FileText, 
  Globe, 
  Database,
  Zap,
  Code2
} from "lucide-react";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";
import { aiWorkflowEngine } from "@/services/aiWorkflowEngine";

const PROMPT_TEMPLATES = [
  {
    id: 'webapp',
    title: 'Web Application',
    icon: Globe,
    prompt: 'Create a modern web application with user authentication, dashboard, and responsive design'
  },
  {
    id: 'api',
    title: 'API Backend',
    icon: Database,
    prompt: 'Build a RESTful API with authentication, CRUD operations, and database integration'
  },
  {
    id: 'component',
    title: 'React Component',
    icon: FileText,
    prompt: 'Generate a reusable React component with TypeScript and proper styling'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack App',
    icon: Zap,
    prompt: 'Create a complete full-stack application with frontend, backend, and database'
  }
];

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isProcessing, clearWorkflow } = useAIStore();
  const { activeProject, createProject, setActiveProject } = useProjectStore();

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;

    // Ensure we have an active project
    if (!activeProject) {
      const newProject = createProject('AI Generated Project', prompt);
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

  const handleTemplateSelect = (template: typeof PROMPT_TEMPLATES[0]) => {
    setPrompt(template.prompt);
    setSelectedTemplate(template.id);
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

        {/* Main Prompt Input Card */}
        <Card className="p-8 backdrop-blur-sm bg-card/80 border-muted shadow-2xl">
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

            {/* Template Suggestions */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                Or choose a template to get started
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROMPT_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                        selectedTemplate === template.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isProcessing && handleTemplateSelect(template)}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-sm mb-1">
                            {template.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.prompt}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
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
        </Card>

        {/* Quick Stats */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
              <span>AI Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-blue-500"></Badge>
              <span>Production Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-purple-500"></Badge>
              <span>Multi-Device</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
