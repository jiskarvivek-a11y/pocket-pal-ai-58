-- Add 'other' to the transaction_category enum
ALTER TYPE public.transaction_category ADD VALUE IF NOT EXISTS 'other';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;

-- Create public access policies (since we're removing auth)
CREATE POLICY "Allow public read access" 
ON public.transactions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.transactions 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON public.transactions 
FOR DELETE 
USING (true);

-- Make user_id nullable since we won't have authenticated users
ALTER TABLE public.transactions ALTER COLUMN user_id DROP NOT NULL;