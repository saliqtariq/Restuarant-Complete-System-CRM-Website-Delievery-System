import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hslohvidzirojizxwgbo.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_qAIhieZQ56Kf4eZAOCyRvg_UdC3TAh2";

export const supabase = createClient(supabaseUrl, supabaseKey);
