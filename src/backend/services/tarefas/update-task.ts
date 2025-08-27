import { createClient } from "@/lib/client";

export interface UpdateTaskInput {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  responsavelId: string;
  associacaoId: string;
  tipoId: string;
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

  const res = await fetch("/api/tarefas/editar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...input, criadorId: user.id }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Erro ao editar tarefa");
  }
}
