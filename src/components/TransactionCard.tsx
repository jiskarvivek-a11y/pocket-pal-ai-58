import { Transaction, formatCurrency, formatTime, categoryConfig } from '@/lib/types';
import { CategoryBadge } from './CategoryBadge';
import { QrCode, Users } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const config = categoryConfig[transaction.category];
  const timestamp = new Date(transaction.created_at);
  
  return (
    <div className="gpay-card flex items-center justify-between gap-4 animate-fade-in hover:scale-[1.01] transition-transform">
      <div className="flex items-center gap-3">
        <div 
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `hsl(var(--category-${transaction.category}) / 0.15)` }}
        >
          {config.emoji}
        </div>
        <div>
          <p className="font-medium text-foreground">{transaction.merchant_name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatTime(timestamp)}</span>
            <span className="text-border">•</span>
            {transaction.payment_type === 'QR' ? (
              <span className="flex items-center gap-1">
                <QrCode className="w-3 h-3" /> QR
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> P2P
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-foreground">{formatCurrency(Number(transaction.amount))}</p>
        <CategoryBadge category={transaction.category} size="sm" />
      </div>
    </div>
  );
};
