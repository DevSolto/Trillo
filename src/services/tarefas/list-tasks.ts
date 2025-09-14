import { requestJson } from '@/services/http'
import { requestJsonServer } from '@/services/http-server'
import type { TaskApi as TaskListItem, Paginated } from '@/types/api'

// Types imported from shared DTOs

export interface ListTasksQuery {
  page?: number
  limit?: number
}

export async function listTasks(q: ListTasksQuery = {}): Promise<Paginated<TaskListItem>> {
  const params = new URLSearchParams()
  if (q.page) params.set('page', String(q.page))
  if (q.limit) params.set('limit', String(q.limit))
  return requestJson<Paginated<TaskListItem>>(`/api/task?${params.toString()}`)
}

export async function listTasksServer(q: ListTasksQuery = {}): Promise<Paginated<TaskListItem>> {
  const params = new URLSearchParams()
  if (q.page) params.set('page', String(q.page))
  if (q.limit) params.set('limit', String(q.limit))
  return requestJsonServer<Paginated<TaskListItem>>(`/api/task?${params.toString()}`)
}
