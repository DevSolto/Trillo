import { createClient } from '@/lib/server';
import { getSupabaseAccessToken } from '@/lib/supabase-token';

export async function getServerAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  return getSupabaseAccessToken(supabase);
}

export async function authServerHeaders(
  extra?: HeadersInit
): Promise<HeadersInit> {
  const token = await getServerAccessToken();
  const h = new Headers(extra);
  if (token) h.set('Authorization', `Bearer ${token}`);
  return h;
}
