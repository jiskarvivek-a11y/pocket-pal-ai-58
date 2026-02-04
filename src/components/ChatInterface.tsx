import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage, Category, categoryConfig, formatCurrency } from '@/lib/types';
import { CategorySelector } from './CategorySelector';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useCreateTransaction } from '@/hooks/useTransactions';
import ReactMarkdown from 'react-markdown';

const merchantNames = [
  'Cafe Coffee Day', 'Swiggy', 'Zomato', 'BigBasket', 'DMart',
  'Apollo Pharmacy', 'MedPlus', 'Uber', 'Ola', 'Rapido',
  'PVR Cinemas', 'BookMyShow', 'Myntra', 'Flipkart', 'Amazon',
  'Local Vendor', 'Street Food', 'Grocery Store', 'Medical Store'
];

export const ChatInterface = () => {
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
  const [pendingCategorization, setPendingCategorization] = useState<{
    amount: number;
    merchantName: string;
    paymentType: 'QR' | 'P2P';
    isRegistered: boolean;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const createTransaction = useCreateTransaction();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
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

    try {
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { message: inputValue },
      });

      if (error) {
        console.error('Chat error:', error);
        throw error;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || "I couldn't process your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCategorySelect = async (category: Category) => {
    if (!pendingCategorization) return;

    const config = categoryConfig[category];
    
    try {
      await createTransaction.mutateAsync({
        amount: pendingCategorization.amount,
        merchantName: pendingCategorization.merchantName,
        category: category,
        paymentType: pendingCategorization.paymentType,
        isRegisteredMerchant: pendingCategorization.isRegistered,
      });

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Got it! Saved ${formatCurrency(pendingCategorization.amount)} at ${pendingCategorization.merchantName} under ${config.emoji} ${config.label} 👍`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Failed to save the transaction. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    
    setPendingCategorization(null);
  };

  const simulateNewPayment = async () => {
    const amount = Math.floor(Math.random() * 500) + 50;
    const isRegistered = Math.random() > 0.3;
    const merchantName = merchantNames[Math.floor(Math.random() * merchantNames.length)];
    const paymentType: 'QR' | 'P2P' = isRegistered ? 'QR' : 'P2P';
    
    setPendingCategorization({
      amount,
      merchantName,
      paymentType,
      isRegistered,
    });
    
    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Quick question - what was this ${formatCurrency(amount)} payment at **${merchantName}** for?`,
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
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
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
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
