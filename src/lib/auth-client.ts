import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/client';
import { getSupabaseAccessToken } from '@/lib/supabase-token';

export async function getAccessToken(): Promise<string | null> {
  const supabase = createClient();
  return getSupabaseAccessToken(supabase);
}

export async function ensureAuthenticated(user?: User | null): Promise<User> {
  if (user) return user;

  const supabase = createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    throw new Error('Usuário não autenticado');
  }

  return currentUser;
}

export async function authHeaders(extra?: HeadersInit): Promise<HeadersInit> {
  const token = await getAccessToken();
  console.log('token', token);
  const h = new Headers(extra);
  if (token) h.set('Authorization', `Bearer ${token}`);
  return h;
}
