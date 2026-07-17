-- Supabase SQL: Create Orders and Order Items Tables
-- Created at: 2026-07-17

-- SQL Schema for Abraham's Table Orders

-- 1. Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Nullable for guest checkout
  order_number TEXT NOT NULL UNIQUE,
  
  -- Customer Details
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  
  -- Financials
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  gst NUMERIC NOT NULL,
  grand_total NUMERIC NOT NULL,
  
  -- Status
  payment_method TEXT NOT NULL, -- 'cod'
  status TEXT NOT NULL DEFAULT 'pending', -- pending, cooking, out_for_delivery, delivered, cancelled
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL
);

-- 3. Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow users to read ONLY their own orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to read ONLY their own order items
CREATE POLICY "Users can view their own order items" 
ON order_items FOR SELECT 
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);

-- Service role bypasses RLS, so the Next.js backend (using SUPABASE_SERVICE_ROLE_KEY)
-- can securely insert orders into these tables without needing RLS insert policies here.
