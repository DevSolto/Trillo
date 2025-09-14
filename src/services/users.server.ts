import type { User, Paginated } from '@/types/api'
import type { ListUsersQuery } from './users'
import { requestJsonServer } from './http-server'

export async function listUsersServer(q: ListUsersQuery = {}): Promise<Paginated<User>> {
  const params = new URLSearchParams()
  if (q.sortOrder) params.set('sortOrder', q.sortOrder)
  if (q.sortBy) params.set('sortBy', q.sortBy)
  if (q.limit) params.set('limit', String(q.limit))
  if (q.page) params.set('page', String(q.page))
  if (q.role) params.set('role', q.role)
  if (q.email) params.set('email', q.email)
  if (q.name) params.set('name', q.name)
  return requestJsonServer<Paginated<User>>(`/api/user?${params.toString()}`)
}

