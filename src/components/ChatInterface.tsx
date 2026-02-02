import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { ChatMessage, Category, Transaction, mockTransactions, formatCurrency, formatDate, formatTime, categoryConfig } from '@/lib/mockData';
import { CategorySelector } from './CategorySelector';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  transactions: Transaction[];
}

// Simple response generator based on query patterns
const generateResponse = (query: string, transactions: Transaction[]): string => {
  const lowerQuery = query.toLowerCase();
  
  // Date-based queries
  if (lowerQuery.includes('15th') || lowerQuery.includes('january 15')) {
    const dayTransactions = transactions.filter(t => t.timestamp.getDate() === 15);
    if (dayTransactions.length === 0) return "Looks like you didn't make any payments on January 15th.";
    
    let response = `Looks like you made ${dayTransactions.length} payment${dayTransactions.length > 1 ? 's' : ''} on 15th January:\n\n`;
    dayTransactions.forEach((t, i) => {
      const config = categoryConfig[t.category];
      response += `${i + 1}. ${formatCurrency(t.amount)} at ${t.merchantName} (${config.label}) - ${formatTime(t.timestamp)}\n`;
    });
    return response.trim();
  }
  
  // Category queries
  if (lowerQuery.includes('food')) {
    const foodTransactions = transactions.filter(t => t.category === 'food');
    const total = foodTransactions.reduce((sum, t) => sum + t.amount, 0);
    let response = `You've spent ${formatCurrency(total)} on Food recently:\n\n`;
    foodTransactions.forEach(t => {
      response += `• ${formatDate(t.timestamp)}: ${formatCurrency(t.amount)} at ${t.merchantName}\n`;
    });
    return response.trim();
  }
  
  if (lowerQuery.includes('medical') || lowerQuery.includes('pharmacy')) {
    const medicalTransactions = transactions.filter(t => t.category === 'medical');
    const total = medicalTransactions.reduce((sum, t) => sum + t.amount, 0);
    return `You've spent ${formatCurrency(total)} on Medical expenses. Your last medical purchase was ${formatCurrency(medicalTransactions[0]?.amount || 0)} at ${medicalTransactions[0]?.merchantName || 'N/A'}.`;
  }
  
  // Total spending
  if (lowerQuery.includes('total') || lowerQuery.includes('how much')) {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return `You've spent ${formatCurrency(total)} in total recently. Want me to break it down by category?`;
  }
  
  // First payment query
  if (lowerQuery.includes('first payment') || lowerQuery.includes('first transaction')) {
    const first = transactions[0];
    if (!first) return "I don't have any transaction records yet.";
    return `You grabbed coffee and breakfast at ${first.merchantName} for ${formatCurrency(first.amount)} in the morning - similar to your usual weekday routine.`;
  }
  
  // Greeting
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return "Hey there! 👋 I'm your financial assistant. Ask me about your spending - like 'What did I spend on food?' or 'Show me my transactions from January 15th'";
  }
  
  // Default
  return "I can help you track your spending! Try asking:\n• 'What happened on 15th January?'\n• 'How much did I spend on food?'\n• 'What was my first payment for?'";
};

export const ChatInterface = ({ transactions }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey! 👋 I'm your financial assistant. Ask me anything about your spending - like 'What did I spend today?' or 'Show me my food expenses'",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingCategorization, setPendingCategorization] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const response = generateResponse(inputValue, transactions);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleCategorySelect = (category: Category | 'custom') => {
    if (category === 'custom') {
      // Handle custom category input
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "What would you like to name this category?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      const config = categoryConfig[category];
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Got it! Saved under ${config.emoji} ${config.label} 👍`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setPendingCategorization(null);
    }
  };

  const simulateNewPayment = () => {
    const amount = Math.floor(Math.random() * 500) + 50;
    setPendingCategorization(Date.now().toString());
    
    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Quick question - what was this ${formatCurrency(amount)} payment for?`,
      timestamp: new Date(),
      categoryPrompt: true,
      pendingTransactionId: Date.now().toString(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex animate-slide-up',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'chat-bubble',
                message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
              )}
            >
              <p className="whitespace-pre-line text-sm">{message.content}</p>
              {message.categoryPrompt && pendingCategorization && (
                <div className="mt-3">
                  <CategorySelector onSelect={handleCategorySelect} />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="chat-bubble chat-bubble-assistant">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-2">
        <button 
          onClick={simulateNewPayment}
          className="text-xs text-primary hover:underline"
        >
          + Simulate new payment (demo)
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your spending..."
              className="w-full px-4 py-3 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
