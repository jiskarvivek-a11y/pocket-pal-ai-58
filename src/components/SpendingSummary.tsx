import { Transaction, Category, categoryConfig, formatCurrency } from '@/lib/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SpendingSummaryProps {
  transactions: Transaction[];
}

export const SpendingSummary = ({ transactions }: SpendingSummaryProps) => {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<Category, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4) as [Category, number][];

  const topCategory = sortedCategories[0];
  const topCategoryConfig = topCategory ? categoryConfig[topCategory[0]] : null;

  return (
    <div className="space-y-4">
      {/* Total Spending Card */}
      <div className="gpay-card-elevated bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <p className="text-sm opacity-90 mb-1">Total Spent</p>
        <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
        <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
          <TrendingDown className="w-4 h-4" />
          <span>12% less than last week</span>
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
              <div key={category} className="space-y-1.5">
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
              </div>
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
              <span className="font-medium">{topCategoryConfig.emoji} {topCategoryConfig.label}</span> is your top spending category this week
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
