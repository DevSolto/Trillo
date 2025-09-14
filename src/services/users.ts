import { requestJson, requestVoid } from './http'
import { requestJsonServer } from './http-server'
import type { User, UserRole, Paginated, CreateUserDto, UpdateUserDto } from '@/types/api'

export interface ListUsersQuery {
  sortOrder?: 'ASC' | 'DESC'
  sortBy?: 'id' | 'name' | 'email' | 'role'
  limit?: number
  page?: number
  role?: UserRole
  email?: string
  name?: string
}

export async function listUsers(q: ListUsersQuery = {}): Promise<Paginated<User>> {
  const params = new URLSearchParams()
  if (q.sortOrder) params.set('sortOrder', q.sortOrder)
  if (q.sortBy) params.set('sortBy', q.sortBy)
  if (q.limit) params.set('limit', String(q.limit))
  if (q.page) params.set('page', String(q.page))
  if (q.role) params.set('role', q.role)
  if (q.email) params.set('email', q.email)
  if (q.name) params.set('name', q.name)
  return requestJson<Paginated<User>>(`/api/user?${params.toString()}`)
}

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

export async function createUser(body: CreateUserDto): Promise<User> {
  return requestJson<User>('/api/user', { method: 'POST', body })
}

export async function getUserById(id: string): Promise<User> {
  return requestJson<User>(`/api/user/id/${encodeURIComponent(id)}`)
}

export async function getUserByEmail(email: string): Promise<User> {
  return requestJson<User>(`/api/user/email/${encodeURIComponent(email)}`)
}

export async function updateUser(id: string, body: UpdateUserDto): Promise<void> {
  await requestJson<void>(`/api/user/${encodeURIComponent(id)}`, { method: 'PATCH', body })
}

export async function deleteUser(id: string): Promise<void> {
  await requestVoid(`/api/user/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
