-- Supabase SQL: Create Email Verifications Table
-- Created at: 2026-07-17

CREATE TABLE email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_email_verifications_email ON email_verifications(email);
