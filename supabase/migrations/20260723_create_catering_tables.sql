-- Catering event inquiry requests
CREATE TABLE IF NOT EXISTS catering_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  event_type TEXT NOT NULL DEFAULT 'Family Reunion',
  guest_count TEXT NOT NULL DEFAULT '50-100',
  event_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',          -- new | contacted | confirmed | cancelled
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_catering_requests_status ON catering_requests(status);
CREATE INDEX IF NOT EXISTS idx_catering_requests_created ON catering_requests(created_at DESC);

-- Enable RLS
ALTER TABLE catering_requests ENABLE ROW LEVEL SECURITY;

-- Public insert policy (website visitors can submit)
CREATE POLICY "Anyone can submit catering request"
  ON catering_requests FOR INSERT
  WITH CHECK (true);

-- Service role can do everything (admin dashboard)
CREATE POLICY "Service role full access on catering_requests"
  ON catering_requests FOR ALL
  USING (auth.role() = 'service_role');
