import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { ChatInterface } from '@/components/ChatInterface';
import { TransactionCard } from '@/components/TransactionCard';
import { SpendingSummary } from '@/components/SpendingSummary';
import { mockTransactions, formatDate } from '@/lib/mockData';
import { Settings, Bell, Shield, HelpCircle } from 'lucide-react';

type Tab = 'chat' | 'transactions' | 'insights' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  // Group transactions by date
  const groupedTransactions = mockTransactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof mockTransactions>);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface transactions={mockTransactions} />;
      
      case 'transactions':
        return (
          <div className="p-4 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
            {Object.entries(groupedTransactions)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, transactions]) => (
                <div key={date} className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2">
                    {date}
                  </h3>
                  {transactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ))}
          </div>
        );
      
      case 'insights':
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">Spending Insights</h2>
            <SpendingSummary transactions={mockTransactions} />
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Settings</h2>
            
            <div className="space-y-2">
              {[
                { icon: Bell, label: 'Notifications', desc: 'Manage alerts and reminders' },
                { icon: Shield, label: 'Privacy & Security', desc: 'Control your data' },
                { icon: HelpCircle, label: 'Help & Support', desc: 'Get assistance' },
              ].map(({ icon: Icon, label, desc }) => (
                <button
                  key={label}
                  className="gpay-card w-full flex items-center gap-4 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
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
