import { apiUrl } from '@/lib/endpoints'
import { getAccessToken } from '@/lib/auth-client'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface RequestOptions {
  method?: HttpMethod
  headers?: HeadersInit
  body?: unknown
}

function mergeHeaders(base: Headers, extra?: HeadersInit) {
  if (!extra) return base
  if (extra instanceof Headers) {
    extra.forEach((v, k) => base.set(k, v))
  } else if (Array.isArray(extra)) {
    extra.forEach(([k, v]) => base.set(k, v))
  } else {
    Object.entries(extra).forEach(([k, v]) => base.set(k, String(v)))
  }
  return base
}

async function buildHeaders(extra?: HeadersInit): Promise<Headers> {
  const token = await getAccessToken()
  const h = new Headers({ Accept: 'application/json' })
  if (token) h.set('Authorization', `Bearer ${token}`)
  return mergeHeaders(h, extra)
}

export async function requestJson<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = apiUrl(path)
  const headers = await buildHeaders({ 'Content-Type': 'application/json', ...(opts.headers || {}) })
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  })

  const ct = res.headers.get('content-type') || ''
  const raw = await res.text()
  const maybeJson = ct.includes('application/json')
  let parsed: unknown = undefined
  if (maybeJson) {
    try { parsed = JSON.parse(raw) } catch {}
  }

  if (!res.ok) {
    const apiMessage = (typeof parsed === 'object' && parsed && 'message' in parsed
      ? (parsed as { message?: string }).message
      : typeof parsed === 'object' && parsed && 'error' in parsed
        ? (parsed as { error?: string }).error
        : undefined) ?? raw
    console.error(`[HTTP ${opts.method || 'GET'}] ${path} -> ${res.status}: ${apiMessage}`)
    throw new Error(apiMessage)
  }

  if (!maybeJson) {
    console.error(`[HTTP] ${path} -> Non-JSON content-type: ${ct}; preview:`, raw.slice(0, 200))
    throw new Error('Non-JSON response')
  }
  if (parsed === undefined) {
    console.error(`[HTTP] ${path} -> Invalid JSON; preview:`, raw.slice(0, 200))
    throw new Error('Invalid JSON response')
  }
  return parsed as T
}

export async function requestVoid(path: string, opts: RequestOptions = {}): Promise<void> {
  const url = apiUrl(path)
  const headers = await buildHeaders({ ...(opts.headers || {}) })
  const res = await fetch(url, {
    method: opts.method || 'DELETE',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  })
  if (!res.ok) {
    const ct = res.headers.get('content-type') || ''
    const raw = await res.text()
    const data = ct.includes('application/json') ? (() => { try { return JSON.parse(raw) } catch { return null } })() : null
    const message = (data?.message ?? data?.error ?? raw) as string
    console.error(`[HTTP ${opts.method || 'DELETE'}] ${path} -> ${res.status}: ${message}`)
    throw new Error(message)
  }
}
