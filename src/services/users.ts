import { toQueryString } from '@/lib/utils';
import { requestJson, requestVoid } from './http';
import type {
  User,
  UserRole,
  Paginated,
  CreateUserDto,
  UpdateUserDto,
} from '@/types/api';

export interface ListUsersQuery {
  sortOrder?: 'ASC' | 'DESC';
  sortBy?: 'id' | 'name' | 'email' | 'role';
  limit?: number;
  page?: number;
  role?: UserRole;
  email?: string;
  name?: string;
}

export async function listUsers(
  q: ListUsersQuery = {}
): Promise<Paginated<User>> {
  const params = toQueryString({
    sortOrder: q.sortOrder,
    sortBy: q.sortBy,
    limit: q.limit ?? undefined,
    page: q.page ?? undefined,
    role: q.role,
    email: q.email || undefined,
    name: q.name || undefined,
  });
  return requestJson<Paginated<User>>(`/api/user?${params.toString()}`);
}

// Server-side variant moved to users.server.ts to avoid client bundles pulling server-only code.

export async function createUser(body: CreateUserDto): Promise<User> {
  return requestJson<User>('/api/user', { method: 'POST', body });
}

export async function getUserById(id: string): Promise<User> {
  return requestJson<User>(`/api/user/id/${encodeURIComponent(id)}`);
}

export async function getUserByEmail(email: string): Promise<User> {
  return requestJson<User>(`/api/user/email/${encodeURIComponent(email)}`);
}

export async function updateUser(
  id: string,
  body: UpdateUserDto
): Promise<void> {
  await requestJson<void>(`/api/user/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body,
  });
}

export async function deleteUser(id: string): Promise<void> {
  await requestVoid(`/api/user/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
