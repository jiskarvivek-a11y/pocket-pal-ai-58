export type Category = 'food' | 'daily' | 'medical' | 'transport' | 'entertainment' | 'shopping';

export interface Transaction {
  id: string;
  amount: number;
  merchantName: string;
  category: Category;
  timestamp: Date;
  paymentType: 'QR' | 'P2P';
  isRegisteredMerchant: boolean;
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

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 180,
    merchantName: 'Cafe Coffee Day',
    category: 'food',
    timestamp: new Date('2025-01-15T09:30:00'),
    paymentType: 'QR',
    isRegisteredMerchant: true,
  },
  {
    id: '2',
    amount: 450,
    merchantName: 'Apollo Pharmacy',
    category: 'medical',
    timestamp: new Date('2025-01-15T14:15:00'),
    paymentType: 'QR',
    isRegisteredMerchant: true,
  },
  {
    id: '3',
    amount: 120,
    merchantName: 'Local Vendor',
    category: 'daily',
    timestamp: new Date('2025-01-15T19:00:00'),
    paymentType: 'P2P',
    isRegisteredMerchant: false,
  },
  {
    id: '4',
    amount: 350,
    merchantName: 'Swiggy',
    category: 'food',
    timestamp: new Date('2025-01-16T13:00:00'),
    paymentType: 'QR',
    isRegisteredMerchant: true,
  },
  {
    id: '5',
    amount: 2500,
    merchantName: 'Big Bazaar',
    category: 'shopping',
    timestamp: new Date('2025-01-17T11:30:00'),
    paymentType: 'QR',
    isRegisteredMerchant: true,
  },
  {
    id: '6',
    amount: 150,
    merchantName: 'Uber',
    category: 'transport',
    timestamp: new Date('2025-01-17T18:45:00'),
    paymentType: 'QR',
    isRegisteredMerchant: true,
  },
  {
    id: '7',
    amount: 500,
    merchantName: 'PVR Cinemas',
    category: 'entertainment',
    timestamp: new Date('2025-01-18T20:00:00'),
    paymentType: 'QR',
    isRegisteredMerchant: true,
  },
  {
    id: '8',
    amount: 85,
    merchantName: 'Tea Stall',
    category: 'food',
    timestamp: new Date('2025-01-19T08:00:00'),
    paymentType: 'P2P',
    isRegisteredMerchant: false,
  },
];

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
