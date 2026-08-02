import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/lib/env";

// Lazily-initialised singleton so env vars are only read at request time,
// not at module-load time (which would crash static build if vars are absent).
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", { minLength: 10 });
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY", {
    minLength: 20,
  });

  // Server-side Supabase client with service role key.
  // Used for admin operations (updating user app_metadata, managing verification records).
  // This client bypasses Row Level Security.
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseAdmin;
}

// Re-export as a Proxy so existing code can use `supabaseAdmin.from(...)` unchanged.
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop as string | symbol];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
