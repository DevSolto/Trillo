import { toQueryString } from '@/lib/utils';
import { requestJson, requestVoid } from './http';
import type {
  Association,
  CreateAssociationDto,
  UpdateAssociationDto,
  Paginated,
} from '@/types/api';

export interface ListAssociationsQuery {
  sortOrder?: 'ASC' | 'DESC';
  sortBy?: 'id' | 'name' | 'cnpj' | 'status';
  limit?: number;
  page?: number;
  status?: boolean;
  cnpj?: string;
  name?: string;
}

export async function listAssociations(
  q: ListAssociationsQuery = {}
): Promise<Paginated<Association>> {
  const params = toQueryString({
    sortOrder: q.sortOrder,
    sortBy: q.sortBy,
    limit: q.limit ?? undefined,
    page: q.page ?? undefined,
    status: typeof q.status === 'boolean' ? q.status : undefined,
    cnpj: q.cnpj || undefined,
    name: q.name || undefined,
  });
  return requestJson<Paginated<Association>>(
    `/api/association?${params.toString()}`
  );
}

// Server-side variant moved to associations.server.ts to avoid client bundles pulling server-only code.

export async function createAssociation(
  body: CreateAssociationDto
): Promise<Association> {
  return requestJson<Association>('/api/association', { method: 'POST', body });
}

export async function getAssociationById(id: string): Promise<Association> {
  return requestJson<Association>(
    `/api/association/id/${encodeURIComponent(id)}`
  );
}

export async function getAssociationByCnpj(cnpj: string): Promise<Association> {
  return requestJson<Association>(
    `/api/association/cnpj/${encodeURIComponent(cnpj)}`
  );
}

export async function updateAssociation(
  id: string,
  body: UpdateAssociationDto
): Promise<void> {
  await requestJson<void>(`/api/association/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body,
  });
}

export async function deleteAssociation(id: string): Promise<void> {
  await requestVoid(`/api/association/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
