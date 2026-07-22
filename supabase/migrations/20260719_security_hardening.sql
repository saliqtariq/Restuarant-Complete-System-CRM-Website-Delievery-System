-- Security hardening: protect verification codes and restrict order views

-- 1. Lock down email_verifications (service role only)
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.email_verifications FROM anon, authenticated;
GRANT ALL ON public.email_verifications TO service_role;

-- 2. Remove public access to order views containing customer PII
REVOKE SELECT ON public.delivery_orders FROM anon, authenticated;
REVOKE SELECT ON public.pickup_orders FROM anon, authenticated;
GRANT SELECT ON public.delivery_orders TO service_role;
GRANT SELECT ON public.pickup_orders TO service_role;
