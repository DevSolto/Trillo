import { createClient } from '@/lib/client'

export async function getAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export async function authHeaders(extra?: HeadersInit): Promise<HeadersInit> {
  const token = await getAccessToken()
  const h = new Headers(extra)
  if (token) h.set('Authorization', `Bearer ${token}`)
  return h
}
