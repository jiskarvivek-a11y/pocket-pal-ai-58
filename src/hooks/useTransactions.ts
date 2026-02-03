import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, Category, PaymentType } from '@/lib/types';
import { toast } from 'sonner';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      return (data || []).map(t => ({
        ...t,
        category: t.category as Category,
        payment_type: t.payment_type as PaymentType,
      }));
    },
  });
};

interface CreateTransactionParams {
  amount: number;
  merchantName: string;
  category: Category;
  paymentType: PaymentType;
  isRegisteredMerchant: boolean;
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateTransactionParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: params.amount,
          merchant_name: params.merchantName,
          category: params.category,
          payment_type: params.paymentType,
          is_registered_merchant: params.isRegisteredMerchant,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add transaction');
      console.error(error);
    },
  });
};

export const useTransactionsByDate = () => {
  const { data: transactions, ...rest } = useTransactions();

  const groupedByDate = transactions?.reduce((groups, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return { groupedByDate, transactions, ...rest };
};

export const useTransactionsByCategory = () => {
  const { data: transactions, ...rest } = useTransactions();

  const groupedByCategory = transactions?.reduce((groups, transaction) => {
    const category = transaction.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(transaction);
    return groups;
  }, {} as Record<Category, Transaction[]>);

  const categoryTotals = transactions?.reduce((totals, transaction) => {
    const category = transaction.category;
    totals[category] = (totals[category] || 0) + Number(transaction.amount);
    return totals;
  }, {} as Record<Category, number>);

  return { groupedByCategory, categoryTotals, transactions, ...rest };
};
