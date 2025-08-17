
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Clock, 
  Code2, 
  Lightbulb, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowDown,
  Zap
} from 'lucide-react';
import { useAIStore } from '@/stores/aiStore';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error' | 'thinking' | 'coding' | 'analyzing';
  workflowStep?: string;
  progress?: number;
}

const ChatMessages = () => {
  const { messages = [], isProcessing } = useAIStore();

  // Sample messages for demonstration
  const sampleMessages: Message[] = [
    {
      id: '1',
      type: 'system',
      content: 'NovaPilot AI Assistant initialized. Ready to help you build amazing applications.',
      timestamp: new Date(Date.now() - 120000),
      status: 'sent'
    },
    {
      id: '2',
      type: 'user',
      content: 'Create a modern web application with user authentication and dashboard',
      timestamp: new Date(Date.now() - 60000),
      status: 'sent'
    },
    {
      id: '3',
      type: 'ai',
      content: 'Perfect! I\'ll create a modern web application with authentication and dashboard for you.',
      timestamp: new Date(Date.now() - 50000),
      status: 'analyzing',
      workflowStep: 'Analyzing requirements'
    },
    {
      id: '4',
      type: 'ai',
      content: 'Setting up project structure with React, TypeScript, and Tailwind CSS...',
      timestamp: new Date(Date.now() - 40000),
      status: 'coding',
      workflowStep: 'Creating project structure',
      progress: 25
    },
    {
      id: '5',
      type: 'ai',
      content: 'Implementing authentication system with login, register, and protected routes...',
      timestamp: new Date(Date.now() - 30000),
      status: 'coding',
      workflowStep: 'Building authentication',
      progress: 60
    },
    {
      id: '6',
      type: 'ai',
      content: 'Creating responsive dashboard with navigation, widgets, and data visualization...',
      timestamp: new Date(Date.now() - 20000),
      status: 'coding',
      workflowStep: 'Designing dashboard',
      progress: 85
    },
    {
      id: '7',
      type: 'ai',
      content: 'Your modern web application is ready! I\'ve created a complete authentication system with a responsive dashboard featuring user management, analytics widgets, and a clean interface.',
      timestamp: new Date(Date.now() - 10000),
      status: 'sent'
    }
  ];

  const allMessages = messages.length > 0 ? messages : sampleMessages;

  const getMessageIcon = (type: string, status?: string) => {
    if (type === 'user') return <User className="h-4 w-4" />;
    if (type === 'system') return <Zap className="h-4 w-4" />;
    
    // AI status-specific icons
    switch (status) {
      case 'thinking':
      case 'analyzing':
        return <Lightbulb className="h-4 w-4" />;
      case 'coding':
        return <Code2 className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageBg = (type: string, status?: string) => {
    switch (type) {
      case 'user':
        return 'bg-gradient-to-br from-primary/8 to-primary/4 border-primary/30 glass-panel';
      case 'system':
        return 'bg-gradient-to-br from-accent/20 to-accent/10 border-accent/40 glass-panel';
      case 'ai':
        if (status === 'error') return 'bg-gradient-to-br from-destructive/8 to-destructive/4 border-destructive/30 glass-panel';
        if (status === 'thinking' || status === 'analyzing') return 'bg-gradient-to-br from-yellow-500/8 to-yellow-500/4 border-yellow-500/30 glass-panel';
        if (status === 'coding') return 'bg-gradient-to-br from-green-500/8 to-green-500/4 border-green-500/30 glass-panel';
        return 'bg-gradient-to-br from-card/80 to-muted/60 border-border/60 glass-panel';
      default:
        return 'bg-gradient-to-br from-card/80 to-card/60 border-border/60 glass-panel';
    }
  };

  const renderWorkflowConnector = (index: number, isLast: boolean) => {
    if (isLast) return null;
    return (
      <div className="flex justify-center py-3">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-px h-6 bg-gradient-to-b from-border/60 to-transparent" />
          <ArrowDown className="h-4 w-4 text-muted-foreground/60 animate-pulse" />
          <div className="w-px h-6 bg-gradient-to-t from-border/60 to-transparent" />
        </div>
      </div>
    );
  };

  const renderProgressBar = (progress?: number) => {
    if (!progress) return null;
    return (
      <div className="mt-3 w-full bg-muted/40 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-500 ease-out shadow-sm animate-progress-fill"
          style={{ 
            width: `${progress}%`,
            '--progress-width': `${progress}%`
          } as React.CSSProperties}
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm">
      <ScrollArea className="flex-1 p-6 scrollbar-thin">
        <div className="space-y-3">
          {allMessages.map((message, index) => (
            <React.Fragment key={message.id}>
              <div className={`flex items-start space-x-4 p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md animate-message-slide-in ${getMessageBg(message.type, message.status)}`}>
                <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-background shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-foreground text-sm border border-primary/20">
                    {getMessageIcon(message.type, message.status)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      {message.type === 'ai' ? 'NovaPilot' : message.type === 'system' ? 'System' : 'You'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.status && message.status !== 'sent' && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-0.5 ${
                          message.status === 'error' 
                            ? 'bg-destructive/10 text-destructive border-destructive/20' 
                            : message.status === 'thinking' || message.status === 'analyzing'
                            ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                            : message.status === 'coding'
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}
                      >
                        {message.status}
                      </Badge>
                    )}
                  </div>
                  
                  {message.workflowStep && (
                    <div className="text-xs text-muted-foreground mb-2 font-medium">
                      {message.workflowStep}
                    </div>
                  )}
                  
                  <div className="text-sm text-foreground leading-relaxed break-words">
                    {message.content}
                  </div>
                  
                  {renderProgressBar(message.progress)}
                </div>
              </div>
              {renderWorkflowConnector(index, index === allMessages.length - 1)}
            </React.Fragment>
          ))}
          
          {isProcessing && (
            <>
              {allMessages.length > 0 && renderWorkflowConnector(allMessages.length, false)}
              <div className="flex items-start space-x-4 p-4 rounded-xl border bg-primary/5 border-primary/20">
                <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-background">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    <Lightbulb className="h-4 w-4 animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-semibold text-foreground">NovaPilot</span>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20 animate-pulse">
                      thinking
                    </Badge>
                  </div>
                  
                   <div className="text-sm text-muted-foreground flex items-center space-x-4">
                     <div className="flex space-x-1.5">
                       <div className="w-2.5 h-2.5 bg-primary rounded-full animate-typing-dots"></div>
                       <div className="w-2.5 h-2.5 bg-primary rounded-full animate-typing-dots" style={{ animationDelay: '0.2s' }}></div>
                       <div className="w-2.5 h-2.5 bg-primary rounded-full animate-typing-dots" style={{ animationDelay: '0.4s' }}></div>
                     </div>
                     <span className="font-medium">Analyzing your request and planning the solution...</span>
                   </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;
