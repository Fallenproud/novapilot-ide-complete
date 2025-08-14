
import { useState } from "react";
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
  Zap
} from "lucide-react";
import { useAIStore } from "@/stores/aiStore";

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

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { addMessage, setUserPrompt, setCurrentStep, isProcessing } = useAIStore();

  const handleSubmit = () => {
    if (!prompt.trim() || isProcessing) return;

    // Add user message
    addMessage({
      type: 'user',
      content: prompt,
      step: 'request'
    });

    // Set user prompt in AI store
    setUserPrompt(prompt);
    setCurrentStep('request');

    // Start AI processing simulation
    setTimeout(() => {
      setCurrentStep('analysis');
      addMessage({
        type: 'ai',
        content: 'Analyzing your request and scanning existing project structure...',
        step: 'analysis'
      });
    }, 500);

    // Clear input
    setPrompt('');
    setSelectedTemplate(null);
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
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-[#F0F6FC] mb-2 block">
          Describe what you want to build
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Create a task management app with drag-and-drop functionality..."
          className="bg-[#21262D] border-[#30363D] text-[#F0F6FC] placeholder:text-[#8B949E] resize-none"
          rows={4}
        />
        <div className="mt-2 text-xs text-[#8B949E]">
          Press ⌘⏎ (Ctrl+Enter) to send
        </div>
      </div>

      {/* Template Suggestions */}
      <div>
        <label className="text-xs font-medium text-[#8B949E] mb-2 block uppercase tracking-wider">
          Quick Templates
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PROMPT_TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-[#21262D] border-[#30363D] ${
                  selectedTemplate === template.id ? 'bg-[#21262D] border-[#1F6FEB]' : 'bg-[#161B22]'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-start space-x-2">
                  <Icon className="h-4 w-4 text-[#1F6FEB] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[#F0F6FC]">
                      {template.title}
                    </div>
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
        className="w-full bg-[#1F6FEB] hover:bg-[#1F6FEB]/90 text-white"
      >
        {isProcessing ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Generate Application
          </>
        )}
      </Button>
    </div>
  );
};

export default PromptInput;
