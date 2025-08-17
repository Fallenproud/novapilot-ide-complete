
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
    <div className="h-full flex flex-col bg-card border-t border-border">
      <div className="flex-1 flex flex-col p-6">
        {/* Templates Button */}
        <div className="mb-4">
          <TemplatesPopup 
            onSelectTemplate={handleTemplateSelect}
            trigger={
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Layers className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            }
          />
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-end">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want to build... (⌘+Enter to send)"
                className="min-h-[100px] pr-12 resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSubmit}
                disabled={!prompt.trim() || isProcessing}
                size="sm"
                className="absolute bottom-3 right-3 h-8 w-8 p-0"
              >
                {isProcessing ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
