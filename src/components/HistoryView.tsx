import { useState } from 'react';
import { TransactionCard } from './TransactionCard';
import { SpendingSummary } from './SpendingSummary';
import { Transaction, formatDate } from '@/lib/mockData';
import { Receipt, PieChart, Settings, Bell, Shield, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type HistorySection = 'transactions' | 'insights' | 'settings';

interface HistoryViewProps {
  transactions: Transaction[];
}

export const HistoryView = ({ transactions }: HistoryViewProps) => {
  const [activeSection, setActiveSection] = useState<HistorySection>('transactions');

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  const sections: { id: HistorySection; icon: React.ElementType; label: string }[] = [
    { id: 'transactions', icon: Receipt, label: 'Transactions' },
    { id: 'insights', icon: PieChart, label: 'Insights' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'transactions':
        return (
          <div className="space-y-6">
            {Object.entries(groupedTransactions)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, txns]) => (
                <div key={date} className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2 z-10">
                    {date}
                  </h3>
                  {txns.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ))}
          </div>
        );

      case 'insights':
        return <SpendingSummary transactions={transactions} />;

      case 'settings':
        return (
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Section Tabs */}
      <div className="flex gap-2 p-4 pb-2 overflow-x-auto">
        {sections.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeSection === id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pt-2">
        {renderContent()}
      </div>
    </div>
  );
};
