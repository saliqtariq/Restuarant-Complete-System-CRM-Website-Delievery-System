-- Drop old table if it exists with wrong schema, then recreate cleanly
DROP TABLE IF EXISTS public.restaurant_capacity_config;

CREATE TABLE public.restaurant_capacity_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  max_tables_per_slot INTEGER NOT NULL DEFAULT 2,   -- max simultaneous reservations per 90-min window
  max_online_tables   INTEGER NOT NULL DEFAULT 3,   -- total tables designated for online reservations
  slot_duration_minutes INTEGER NOT NULL DEFAULT 90
);

-- Insert default row (only one row ever exists)
INSERT INTO public.restaurant_capacity_config (id, max_tables_per_slot, max_online_tables, slot_duration_minutes)
VALUES (1, 2, 3, 90);

-- Only service role (admin) can access this table
ALTER TABLE public.restaurant_capacity_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON public.restaurant_capacity_config
  USING (false);
