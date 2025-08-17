
import { useEffect, useRef } from 'react';
import { useAIStore } from '@/stores/aiStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Bot, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const ChatMessages = () => {
  const { messages } = useAIStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getStepColor = (step: string) => {
    switch (step) {
      case 'request': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'analysis': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'planning': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'generation': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'execution': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'deployment': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'ai':
        return <Bot className="h-4 w-4" />;
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <Bot className="h-12 w-12 text-[#30363D] mx-auto mb-3" />
          <h3 className="text-lg font-medium text-[#8B949E] mb-2">
            Ready to help you build
          </h3>
          <p className="text-sm text-[#6E7681]">
            Enter a prompt above to start generating your application
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`p-3 border transition-all duration-200 ${
              message.type === 'user' 
                ? 'bg-[#1F6FEB]/10 border-[#1F6FEB]/30 ml-6' 
                : message.type === 'system'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-[#161B22] border-[#30363D] mr-6'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-[#1F6FEB] text-white' 
                  : message.type === 'system'
                  ? 'bg-red-500 text-white'
                  : 'bg-[#21262D] text-[#8B949E]'
              }`}>
                {getMessageIcon(message.type)}
              </div>
              
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm font-medium text-[#F0F6FC]">
                    {message.type === 'user' ? 'You' : message.type === 'system' ? 'System' : 'NovaPilot AI'}
                  </span>
                  {message.step && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-2 py-0.5 ${getStepColor(message.step)}`}
                    >
                      {message.step}
                    </Badge>
                  )}
                  <span className="text-xs text-[#6E7681]">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="text-sm text-[#F0F6FC] whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            </div>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
