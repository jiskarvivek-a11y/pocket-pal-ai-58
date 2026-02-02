import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ChatInterface } from '@/components/ChatInterface';
import { HistoryView } from '@/components/HistoryView';
import { mockTransactions } from '@/lib/mockData';

type Tab = 'ask-ai' | 'history';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ask-ai');

  const renderContent = () => {
    switch (activeTab) {
      case 'ask-ai':
        return <ChatInterface transactions={mockTransactions} />;
      
      case 'history':
        return <HistoryView transactions={mockTransactions} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto border-x border-border">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
