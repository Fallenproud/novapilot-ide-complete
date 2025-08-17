
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Clock } from 'lucide-react';
import { useAIStore } from '@/stores/aiStore';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

const ChatMessages = () => {
  const { messages = [], isProcessing } = useAIStore();

  // Sample messages for demonstration
  const sampleMessages: Message[] = [
    {
      id: '1',
      type: 'system',
      content: 'AI Workflow initialized. Ready to assist with your development needs.',
      timestamp: new Date(Date.now() - 60000),
      status: 'sent'
    },
    {
      id: '2',
      type: 'user',
      content: 'Create a modern web application with user authentication and dashboard',
      timestamp: new Date(Date.now() - 30000),
      status: 'sent'
    },
    {
      id: '3',
      type: 'ai',
      content: 'I\'ll help you create a modern web application with authentication and dashboard. Starting with the project structure and core components...',
      timestamp: new Date(Date.now() - 15000),
      status: 'sent'
    }
  ];

  const allMessages = messages.length > 0 ? messages : sampleMessages;

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'ai':
        return <Bot className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getMessageBg = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-[#1F6FEB]/10 border-[#1F6FEB]/20';
      case 'ai':
        return 'bg-[#21262D] border-[#30363D]';
      default:
        return 'bg-[#161B22] border-[#21262D]';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {allMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getMessageBg(message.type)}`}
            >
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="bg-[#30363D] text-[#F0F6FC] text-xs">
                  {getMessageIcon(message.type)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-[#F0F6FC] capitalize">
                    {message.type === 'ai' ? 'NovaPilot' : message.type}
                  </span>
                  <span className="text-xs text-[#8B949E]">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.status && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-1.5 py-0.5 ${
                        message.status === 'error' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : message.status === 'sending'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}
                    >
                      {message.status}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-[#F0F6FC] leading-relaxed break-words">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-start space-x-3 p-3 rounded-lg border bg-[#21262D] border-[#30363D]">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="bg-[#30363D] text-[#F0F6FC] text-xs">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-[#F0F6FC]">NovaPilot</span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-[#1F6FEB]/10 text-[#1F6FEB] border-[#1F6FEB]/20">
                    processing
                  </Badge>
                </div>
                
                <div className="text-sm text-[#8B949E] flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#1F6FEB] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#1F6FEB] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#1F6FEB] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span>Analyzing your request...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;
