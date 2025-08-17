
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Code, 
  Search, 
  Wand2, 
  MessageSquare,
  Lightbulb,
  Zap,
  History
} from 'lucide-react';
import { LovableAIIntegration, AIResponse } from '@/services/lovable/aiIntegration';

interface AIAssistantPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  selectedCode?: string;
  currentFile?: string;
  className?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: Array<{
    title: string;
    description: string;
    code?: string;
    action?: string;
  }>;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  isVisible, 
  onToggle, 
  selectedCode,
  currentFile,
  className = "" 
}) => {
  const [aiIntegration] = useState(() => new LovableAIIntegration());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI coding assistant. I can help you generate code, review existing code, suggest refactoring, and answer questions. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const context = {
        files: [], // Would come from project store
        selectedText: selectedCode,
        language: currentFile?.split('.').pop() || 'typescript'
      };

      let response: AIResponse;

      // Determine the type of request based on user input
      if (inputValue.toLowerCase().includes('generate') || inputValue.toLowerCase().includes('create')) {
        response = await aiIntegration.generateCode(inputValue, context);
      } else if (inputValue.toLowerCase().includes('review') && selectedCode) {
        response = await aiIntegration.reviewCode(selectedCode, context);
      } else if (inputValue.toLowerCase().includes('refactor') && selectedCode) {
        response = await aiIntegration.suggestRefactoring(selectedCode, context);
      } else {
        response = await aiIntegration.getCompletion(inputValue, context);
      }

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setActiveAction(action);
    
    const actionPrompts = {
      'generate-component': 'Generate a new React component',
      'review-code': selectedCode ? `Review this code: ${selectedCode}` : 'Please select some code first',
      'refactor': selectedCode ? `Suggest refactoring for: ${selectedCode}` : 'Please select some code first',
      'explain': selectedCode ? `Explain this code: ${selectedCode}` : 'Please select some code first',
      'optimize': selectedCode ? `Optimize this code: ${selectedCode}` : 'Please select some code first',
      'debug': 'Help me debug an issue'
    };

    const prompt = actionPrompts[action as keyof typeof actionPrompts] || action;
    setInputValue(prompt);
    
    setTimeout(() => setActiveAction(null), 1000);
  };

  const handleApplySuggestion = (suggestion: any) => {
    if (suggestion.code) {
      // In a real implementation, this would apply the code to the editor
      console.log('Applying suggestion:', suggestion);
      
      // Emit event for editor to handle
      window.dispatchEvent(new CustomEvent('ai:apply-suggestion', {
        detail: { suggestion }
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-[#161B22] border-l border-[#21262D] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#21262D]">
        <div className="flex items-center justify-between">
          <h3 className="text-[#F0F6FC] font-semibold flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>AI Assistant</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-[#8B949E] hover:text-[#F0F6FC]"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-[#21262D]">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('generate-component')}
            className={`text-xs ${activeAction === 'generate-component' ? 'bg-blue-500/20' : ''}`}
          >
            <Code className="h-3 w-3 mr-1" />
            Generate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('review-code')}
            className={`text-xs ${activeAction === 'review-code' ? 'bg-green-500/20' : ''}`}
            disabled={!selectedCode}
          >
            <Search className="h-3 w-3 mr-1" />
            Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('refactor')}
            className={`text-xs ${activeAction === 'refactor' ? 'bg-purple-500/20' : ''}`}
            disabled={!selectedCode}
          >
            <Wand2 className="h-3 w-3 mr-1" />
            Refactor
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('explain')}
            className={`text-xs ${activeAction === 'explain' ? 'bg-yellow-500/20' : ''}`}
            disabled={!selectedCode}
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Explain
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-[#1F6FEB] text-white' 
                  : 'bg-[#0D1117] border border-[#21262D] text-[#F0F6FC]'
              } rounded-lg p-3`}>
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <Bot className="h-4 w-4 mt-0.5 text-[#1F6FEB] flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-[#8B949E] font-medium">Suggestions:</div>
                        {message.suggestions.map((suggestion, index) => (
                          <Card key={index} className="bg-[#161B22] border-[#21262D]">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h6 className="text-[#F0F6FC] text-xs font-medium mb-1">
                                    {suggestion.title}
                                  </h6>
                                  <p className="text-[#8B949E] text-xs mb-2">
                                    {suggestion.description}
                                  </p>
                                  {suggestion.code && (
                                    <pre className="bg-[#0D1117] p-2 rounded text-xs text-[#F0F6FC] overflow-x-auto">
                                      <code>{suggestion.code}</code>
                                    </pre>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleApplySuggestion(suggestion)}
                                  className="ml-2 h-6 px-2 text-xs"
                                >
                                  <Zap className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-[#1F6FEB] animate-pulse" />
                  <div className="text-[#8B949E] text-sm">AI is thinking...</div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-[#21262D]">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI anything about your code..."
            className="flex-1 bg-[#0D1117] border-[#21262D] text-[#F0F6FC]"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {selectedCode && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {selectedCode.length} characters selected
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPanel;
