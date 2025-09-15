import { toQueryString } from '@/lib/utils';
import { requestJson } from '@/services/http';
import { requestJsonServer } from '@/services/http-server';
import type { TaskApi as TaskListItem, Paginated } from '@/types/api';

// Types imported from shared DTOs

export interface ListTasksQuery {
  page?: number;
  limit?: number;
}

export async function listTasks(
  q: ListTasksQuery = {}
): Promise<Paginated<TaskListItem>> {
  const params = toQueryString({
    page: q.page ?? undefined,
    limit: q.limit ?? undefined,
  });
  return requestJson<Paginated<TaskListItem>>(`/api/task?${params.toString()}`);
}

export async function listTasksServer(
  q: ListTasksQuery = {}
): Promise<Paginated<TaskListItem>> {
  const params = toQueryString({
    page: q.page ?? undefined,
    limit: q.limit ?? undefined,
  });
  return requestJsonServer<Paginated<TaskListItem>>(
    `/api/task?${params.toString()}`
  );
}
