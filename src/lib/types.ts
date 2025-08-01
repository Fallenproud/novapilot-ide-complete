
export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}
