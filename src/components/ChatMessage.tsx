
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className={`w-10 h-10 ${message.isUser ? 'bg-blue-500' : 'bg-orange-500'}`}>
        <AvatarFallback className="text-white">
          {message.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </AvatarFallback>
      </Avatar>
      
      <Card className={`max-w-[80%] p-4 ${
        message.isUser 
          ? 'bg-blue-500 text-white ml-auto' 
          : 'bg-white border-orange-200'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        <p className={`text-xs mt-2 opacity-70 ${
          message.isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </Card>
    </div>
  );
};

export default ChatMessage;
