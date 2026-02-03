-- Create category enum
CREATE TYPE public.transaction_category AS ENUM ('food', 'daily', 'medical', 'transport', 'entertainment', 'shopping');

-- Create payment type enum
CREATE TYPE public.payment_type AS ENUM ('QR', 'P2P');

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  merchant_name TEXT NOT NULL,
  category transaction_category NOT NULL,
  payment_type payment_type NOT NULL DEFAULT 'QR',
  is_registered_merchant BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON public.transactions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON public.transactions
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster date-based queries
CREATE INDEX idx_transactions_user_date ON public.transactions (user_id, created_at DESC);

-- Create index for category filtering
CREATE INDEX idx_transactions_category ON public.transactions (user_id, category);