
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  mode: 'chat' | 'build';
}

const DEMO_MESSAGES: ChatMessage[] = [
  {
    type: 'user',
    content: 'Create a modern task management app with drag-and-drop',
    timestamp: '10:30 AM'
  },
  {
    type: 'ai',
    content: 'I\'ll create a modern task management app with drag-and-drop functionality. This will include a Kanban board layout, smooth animations, and a beautiful design.',
    timestamp: '10:30 AM',
    isTyping: false
  },
  {
    type: 'user',
    content: 'Add user authentication and real-time collaboration',
    timestamp: '10:32 AM'
  },
  {
    type: 'ai',
    content: 'Perfect! I\'ll integrate Supabase for authentication and real-time features. Users will be able to collaborate on boards in real-time with instant updates.',
    timestamp: '10:32 AM',
    isTyping: false
  }
];

const ChatPanel = ({ mode }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES.slice(0, 1));
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Simulate conversation flow based on mode
    const timer = setTimeout(() => {
      if (messages.length < DEMO_MESSAGES.length) {
        const nextMessage = DEMO_MESSAGES[messages.length];
        
        if (nextMessage.type === 'ai') {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, nextMessage]);
            setIsTyping(false);
          }, 1500);
        } else {
          setMessages(prev => [...prev, nextMessage]);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: ChatMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          type: 'ai',
          content: mode === 'chat' 
            ? "I can help you with that! Let me analyze your request and provide guidance on best practices and implementation strategies."
            : "I'll create that for you right away! Let me scaffold the components and implement the functionality with modern design patterns.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isTyping: false
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    }, 500);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">
            {mode === 'chat' ? 'Advisory Mode' : 'Build Mode'} Active
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {mode === 'chat' 
            ? 'Ask questions, get guidance, analyze code'
            : 'Generate code, create features, deploy apps'
          }
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] space-x-2 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'}>
                    {message.type === 'user' ? 'U' : 'N'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                  <p className="text-xs text-muted-foreground px-3">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] space-x-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            placeholder={mode === 'chat' ? "Ask a question..." : "Create something amazing..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
