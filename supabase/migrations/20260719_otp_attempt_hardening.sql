-- Track failed OTP attempts so verification codes cannot be brute-forced.

ALTER TABLE public.email_verifications
  ADD COLUMN IF NOT EXISTS failed_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_until timestamptz;

CREATE INDEX IF NOT EXISTS idx_email_verifications_locked_until
  ON public.email_verifications(locked_until);
