import { requestJson, requestVoid } from './http'
import type { Association, CreateAssociationDto, UpdateAssociationDto, Paginated } from '@/types/api'

export interface ListAssociationsQuery {
  sortOrder?: 'ASC' | 'DESC'
  sortBy?: 'id' | 'name' | 'cnpj' | 'status'
  limit?: number
  page?: number
  status?: boolean
  cnpj?: string
  name?: string
}

export async function listAssociations(q: ListAssociationsQuery = {}): Promise<Paginated<Association>> {
  const params = new URLSearchParams()
  if (q.sortOrder) params.set('sortOrder', q.sortOrder)
  if (q.sortBy) params.set('sortBy', q.sortBy)
  if (q.limit) params.set('limit', String(q.limit))
  if (q.page) params.set('page', String(q.page))
  if (typeof q.status === 'boolean') params.set('status', String(q.status))
  if (q.cnpj) params.set('cnpj', q.cnpj)
  if (q.name) params.set('name', q.name)
  return requestJson<Paginated<Association>>(`/api/association?${params.toString()}`)
}

// Server-side variant moved to associations.server.ts to avoid client bundles pulling server-only code.

export async function createAssociation(body: CreateAssociationDto): Promise<Association> {
  return requestJson<Association>('/api/association', { method: 'POST', body })
}

export async function getAssociationById(id: string): Promise<Association> {
  return requestJson<Association>(`/api/association/id/${encodeURIComponent(id)}`)
}

export async function getAssociationByCnpj(cnpj: string): Promise<Association> {
  return requestJson<Association>(`/api/association/cnpj/${encodeURIComponent(cnpj)}`)
}

export async function updateAssociation(id: string, body: UpdateAssociationDto): Promise<void> {
  await requestJson<void>(`/api/association/${encodeURIComponent(id)}`, { method: 'PATCH', body })
}

export async function deleteAssociation(id: string): Promise<void> {
  await requestVoid(`/api/association/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
