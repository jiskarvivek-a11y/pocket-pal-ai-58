export type Category = 'food' | 'daily' | 'medical' | 'transport' | 'entertainment' | 'shopping';

export type PaymentType = 'QR' | 'P2P';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  merchant_name: string;
  category: Category;
  payment_type: PaymentType;
  is_registered_merchant: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  categoryPrompt?: boolean;
  pendingTransactionId?: string;
}

export const categoryConfig: Record<Category, { label: string; emoji: string; color: string }> = {
  food: { label: 'Food', emoji: '🍽️', color: 'bg-orange-100 text-orange-700' },
  daily: { label: 'Daily Needs', emoji: '🛒', color: 'bg-blue-100 text-blue-700' },
  medical: { label: 'Medical', emoji: '💊', color: 'bg-green-100 text-green-700' },
  transport: { label: 'Transport', emoji: '🚗', color: 'bg-purple-100 text-purple-700' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'bg-pink-100 text-pink-700' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: 'bg-yellow-100 text-yellow-700' },
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
