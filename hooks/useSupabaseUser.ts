"use client";

import { useState, useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/backend/supabase";

export function useSupabaseUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}

export function getUserDisplayName(user: SupabaseUser | null): string {
  if (!user) return "User";
  return user.user_metadata?.first_name || user.email?.split("@")[0] || "User";
}
