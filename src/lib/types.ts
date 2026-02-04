export type Category = 'food' | 'daily' | 'medical' | 'transport' | 'entertainment' | 'shopping' | 'other';

export type PaymentType = 'QR' | 'P2P';

export interface Transaction {
  id: string;
  user_id: string | null;
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
  food: { label: 'Food', emoji: '🍽️', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  daily: { label: 'Daily Needs', emoji: '🛒', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  medical: { label: 'Medical', emoji: '💊', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  transport: { label: 'Transport', emoji: '🚗', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  other: { label: 'Other', emoji: '📦', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' },
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
