import type { User } from '@supabase/supabase-js';

import { ensureAuthenticated } from '@/lib/auth-client';
import { httpClient } from '@/services/http';

import { TaskService } from './task-service';

const taskService = new TaskService(httpClient);

export interface UpdateTaskInput {
  id: string;
  titulo?: string;
  descricao?: string;
  prioridade?: string;
  responsavelId?: string; // deprecated: use teamIds
  teamIds?: string[];
  associacaoId?: string;
  status?: string; // open | inProgress | finished | canceled
  data_fim?: Date;
}

export async function updateTask(
  input: UpdateTaskInput,
  user?: User | null
): Promise<void> {
  await ensureAuthenticated(user);

  const body = buildUpdatePayload(input);
  await taskService.updateTask(input.id, body);
}

function buildUpdatePayload(input: UpdateTaskInput): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (input.titulo !== undefined) body.title = input.titulo;
  if (input.descricao !== undefined) body.description = input.descricao;
  if (input.prioridade !== undefined) body.priority = input.prioridade;
  if (input.data_fim !== undefined)
    body.dueDate = input.data_fim
      ? new Date(input.data_fim).toISOString()
      : null;
  if (input.teamIds) body.teamIds = input.teamIds;
  else if (input.responsavelId) body.teamIds = [input.responsavelId];
  if (input.associacaoId) body.associationId = input.associacaoId;
  if (input.status) body.status = input.status; // expecting values: open|inProgress|finished|canceled

  return body;
}
