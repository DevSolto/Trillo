import type { Association, Paginated } from '@/types/api';
import type { ListAssociationsQuery } from './associations';
import { requestJsonServer } from './http-server';

export async function listAssociationsServer(
  q: ListAssociationsQuery = {}
): Promise<Paginated<Association>> {
  const params = new URLSearchParams();
  if (q.sortOrder) params.set('sortOrder', q.sortOrder);
  if (q.sortBy) params.set('sortBy', q.sortBy);
  if (q.limit) params.set('limit', String(q.limit));
  if (q.page) params.set('page', String(q.page));
  if (typeof q.status === 'boolean') params.set('status', String(q.status));
  if (q.cnpj) params.set('cnpj', q.cnpj);
  if (q.name) params.set('name', q.name);
  return requestJsonServer<Paginated<Association>>(
    `/association?${params.toString()}`
  );
}
