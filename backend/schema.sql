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
  order_type TEXT NOT NULL DEFAULT 'delivery', -- 'pickup' or 'delivery'
  payment_method TEXT NOT NULL, -- 'cod', 'easypaisa', 'jazzcash', 'card', etc.
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  status TEXT NOT NULL DEFAULT 'pending', -- awaiting_payment, pending, cooking, out_for_delivery, delivered, cancelled
  
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

-- 3. Create the coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_amount NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create the menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create the menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'new', -- 'new', 'read'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

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

-- Public policies for menu items (anyone can view)
CREATE POLICY "Anyone can view menu categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu items" ON menu_items FOR SELECT USING (true);

-- Public policy for inserting reviews (anyone can leave a suggestion)
CREATE POLICY "Anyone can insert a review" ON reviews FOR INSERT WITH CHECK (true);

-- Service role bypasses RLS, so the Next.js backend (using SUPABASE_SERVICE_ROLE_KEY)
-- can securely insert orders/menu items into these tables without needing RLS insert policies here.
