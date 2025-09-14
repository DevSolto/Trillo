import { createClient } from '@/lib/server'

export async function getServerAccessToken(): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export async function authServerHeaders(extra?: HeadersInit): Promise<HeadersInit> {
  const token = await getServerAccessToken()
  const h = new Headers(extra)
  if (token) h.set('Authorization', `Bearer ${token}`)
  return h
}
