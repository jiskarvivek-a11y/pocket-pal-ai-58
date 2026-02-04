import { useState } from 'react';
import { Transaction, Category, categoryConfig, formatCurrency } from '@/lib/types';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { TransactionCard } from './TransactionCard';

interface SpendingSummaryProps {
  transactions: Transaction[];
}

export const SpendingSummary = ({ transactions }: SpendingSummaryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<Category, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a) as [Category, number][];

  const topCategory = sortedCategories[0];
  const topCategoryConfig = topCategory ? categoryConfig[topCategory[0]] : null;

  // Filter transactions by selected category
  const filteredTransactions = selectedCategory 
    ? transactions.filter(t => t.category === selectedCategory)
    : [];

  if (transactions.length === 0) {
    return (
      <div className="gpay-card text-center py-8">
        <p className="text-muted-foreground">No transactions yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Use "Simulate new payment" in the Ask AI tab to add some!
        </p>
      </div>
    );
  }

  // Show category transactions view
  if (selectedCategory) {
    const config = categoryConfig[selectedCategory];
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Insights
        </button>
        
        <div className="gpay-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{config.emoji}</span>
            <div>
              <h3 className="font-semibold text-foreground">{config.label}</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} • {formatCurrency(categoryTotals[selectedCategory] || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Spending Card */}
      <div className="gpay-card-elevated bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <p className="text-sm opacity-90 mb-1">Total Spent</p>
        <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
        <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
          <TrendingDown className="w-4 h-4" />
          <span>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="gpay-card">
        <h3 className="font-semibold text-foreground mb-3">Spending by Category</h3>
        <div className="space-y-3">
          {sortedCategories.map(([category, amount]) => {
            const config = categoryConfig[category];
            const percentage = Math.round((amount / totalSpent) * 100);
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="w-full text-left space-y-1.5 p-2 -m-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm">
                    <span>{config.emoji}</span>
                    <span className="text-foreground">{config.label}</span>
                  </span>
                  <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: `hsl(var(--category-${category}))`
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Category Insight */}
      {topCategoryConfig && (
        <div className="gpay-card border border-accent bg-accent/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm text-foreground">
              <span className="font-medium">{topCategoryConfig.emoji} {topCategoryConfig.label}</span> is your top spending category
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
