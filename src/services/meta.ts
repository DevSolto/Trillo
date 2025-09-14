import { requestJson } from './http'

export type UserRole = 'admin' | 'editor'
export type TaskStatus = 'open' | 'inProgress' | 'finished' | 'canceled'

export interface AllEnumsResponse {
  userRoles: UserRole[]
  taskStatus: TaskStatus[]
}

export async function getUserRoles(): Promise<UserRole[]> {
  return requestJson<UserRole[]>('/api/meta/enums/user-roles')
}

export async function getTaskStatus(): Promise<TaskStatus[]> {
  return requestJson<TaskStatus[]>('/api/meta/enums/task-status')
}

export async function getAllEnums(): Promise<AllEnumsResponse> {
  return requestJson<AllEnumsResponse>('/api/meta/enums')
}

export async function getPriorities(): Promise<string[]> {
  return requestJson<string[]>('/api/enums/priorities')
}

export async function getTypes(): Promise<string[]> {
  return requestJson<string[]>('/api/enums/types')
}
