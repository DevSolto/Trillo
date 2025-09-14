import { createClient } from "@/lib/client";
import { requestVoid } from "@/services/http";

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

export async function updateTask(input: UpdateTaskInput): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const body: Record<string, unknown> = {};
  if (input.titulo !== undefined) body.title = input.titulo;
  if (input.descricao !== undefined) body.description = input.descricao;
  if (input.prioridade !== undefined) body.priority = input.prioridade;
  if (input.data_fim !== undefined) body.dueDate = input.data_fim ? new Date(input.data_fim).toISOString() : null;
  if (input.teamIds) body.teamIds = input.teamIds;
  else if (input.responsavelId) body.teamIds = [input.responsavelId];
  if (input.associacaoId) body.associationId = input.associacaoId;
  if (input.status) body.status = input.status; // expecting values: open|inProgress|finished|canceled

  await requestVoid(`/api/task/${encodeURIComponent(input.id)}`, { method: "PATCH", body });
}
