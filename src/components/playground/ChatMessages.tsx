
import { useEffect, useRef } from 'react';
import { useAIStore } from '@/stores/aiStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      case 'request': return 'bg-blue-500';
      case 'analysis': return 'bg-yellow-500';
      case 'planning': return 'bg-purple-500';
      case 'generation': return 'bg-green-500';
      case 'execution': return 'bg-orange-500';
      case 'deployment': return 'bg-pink-500';
      default: return 'bg-gray-500';
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Card
          key={message.id}
          className={`p-4 ${
            message.type === 'user' 
              ? 'bg-[#1F6FEB]/10 border-[#1F6FEB]/20 ml-8' 
              : message.type === 'system'
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-[#161B22] border-[#30363D] mr-8'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${
              message.type === 'user' 
                ? 'bg-[#1F6FEB] text-white' 
                : message.type === 'system'
                ? 'bg-red-500 text-white'
                : 'bg-[#21262D] text-[#8B949E]'
            }`}>
              {getMessageIcon(message.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-[#F0F6FC]">
                  {message.type === 'user' ? 'You' : message.type === 'system' ? 'System' : 'NovaPilot AI'}
                </span>
                {message.step && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStepColor(message.step)} text-white`}
                  >
                    {message.step}
                  </Badge>
                )}
                <span className="text-xs text-[#6E7681]">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="text-sm text-[#F0F6FC] whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        </Card>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
