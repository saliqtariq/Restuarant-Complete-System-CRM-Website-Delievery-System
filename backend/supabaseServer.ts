import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/lib/env";

const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", { minLength: 10 });
const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY", {
  minLength: 20,
});

// Server-side Supabase client with service role key.
// Used for admin operations (updating user app_metadata, managing verification records).
// This client bypasses Row Level Security.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
