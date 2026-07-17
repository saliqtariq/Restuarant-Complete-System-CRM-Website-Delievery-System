-- Supabase SQL: Separate Pickup and Delivery Orders
-- Created at: 2026-07-17

-- 1. Add order_type column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_type text DEFAULT 'delivery';

-- 2. Create a View for Delivery Orders
CREATE OR REPLACE VIEW public.delivery_orders AS
SELECT 
  id,
  order_number,
  customer_name,
  phone,
  city,
  delivery_address,
  subtotal,
  delivery_fee,
  gst,
  grand_total,
  payment_method,
  status,
  created_at
FROM public.orders
WHERE order_type = 'delivery';

-- 3. Create a View for Pickup Orders
CREATE OR REPLACE VIEW public.pickup_orders AS
SELECT 
  id,
  order_number,
  customer_name,
  phone,
  delivery_address AS pickup_branch, 
  subtotal,
  gst,
  grand_total,
  payment_method,
  status,
  created_at
FROM public.orders
WHERE order_type = 'pickup';

-- Permissions
GRANT SELECT ON public.delivery_orders TO authenticated, anon, service_role;
GRANT SELECT ON public.pickup_orders TO authenticated, anon, service_role;
