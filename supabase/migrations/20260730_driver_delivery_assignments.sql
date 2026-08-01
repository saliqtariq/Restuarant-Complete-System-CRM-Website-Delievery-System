-- Supabase SQL: Delivery Assignments
-- Created at: 2026-07-30

-- 1. Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  cnic TEXT NOT NULL,
  email TEXT,
  home_address TEXT NOT NULL,
  branch TEXT NOT NULL,
  status TEXT DEFAULT 'Active', -- Active, Offline, On Delivery
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create delivery_assignments table
CREATE TABLE IF NOT EXISTS delivery_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  delivery_token TEXT UNIQUE NOT NULL,
  driver_notes TEXT,
  status TEXT DEFAULT 'assigned'
);

-- 2. Add assigned_driver_id to orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL;

-- 3. RLS Policies
ALTER TABLE delivery_assignments ENABLE ROW LEVEL SECURITY;

-- Allow public access to view delivery assignments by token for the tracking page
CREATE POLICY "Public can view delivery assignment by token"
ON delivery_assignments FOR SELECT
USING (true);

-- Allow authenticated users (drivers/admin) to view/update
CREATE POLICY "Authenticated users can view/update delivery assignments"
ON delivery_assignments FOR ALL
TO authenticated
USING (true);
