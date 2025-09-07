
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Layers } from "lucide-react";
import { useAIStore } from "@/stores/aiStore";
import { aiWorkflowEngine } from "@/services/aiWorkflowEngine";
import TemplatesPopup from "./TemplatesPopup";


const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const { isProcessing, clearWorkflow } = useAIStore();

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;

    // Clear previous workflow
    clearWorkflow();

    // Start AI workflow
    await aiWorkflowEngine.executeWorkflow(prompt);

    // Clear input
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTemplateSelect = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  return (
    <div className="flex flex-col bg-sidebar border-t border-sidebar-border">
      <div className="p-3">
        <TemplatesPopup 
          onSelectTemplate={handleTemplateSelect}
          trigger={
            <Button variant="outline" size="sm" className="w-full justify-start hover:bg-accent/20 transition-all duration-200">
              <Layers className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          }
        />
      </div>
      <div className="p-3 pt-0">
        <div className="relative group">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build... (⌘+Enter to send)"
            className="min-h-[80px] pr-14 resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/40 rounded-lg shadow-sm transition-all duration-200"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isProcessing}
            size="sm"
            className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {isProcessing ? (
              <Sparkles className="h-4 w-4 animate-spin text-primary-foreground" />
            ) : (
              <Send className="h-4 w-4 text-primary-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
