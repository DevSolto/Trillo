import type { SupabaseClient } from '@supabase/supabase-js';

export async function getSupabaseAccessToken(
  supabase: SupabaseClient
): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}
