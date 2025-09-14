// app/(private)/tarefas/page.tsx
import { columns, type Task } from './components/columns';
import { DataTable } from './components/DataTable';
import { listTasksServer } from '@/services/tarefas/list-tasks';

// Dados vêm do backend externo via proxy /api, usando serviço SSR.

export default async function TarefasPage() {
  let tarefas: {
    id: string;
    createdAt: string;
    title: string;
    description: string;
    status?: string | null;
    dueDate?: string | null;
    association?: { id: string; name?: string | null } | null;
    team?: { id: string }[] | null;
  }[] = [];
  try {
    const data = await listTasksServer({ page: 1, limit: 100 });
    tarefas = data?.items ?? [];
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falha ao buscar tarefas (usando lista vazia).', error);
    }
  }

  const tasks: Task[] = (tarefas ?? []).map((t) => ({
    id: t.id,
    createdAt: t.createdAt,
    title: t.title,
    description: t.description,
    status: t.status ?? null,
    label: null,
    priority: null,
    endDate: t.dueDate ?? null,
    responsavelId: t.team?.[0]?.id ?? null,
    teamIds: Array.isArray(t.team) ? t.team.map((u) => u.id) : [],
    associacaoId: t.association?.id ?? null,
    associacao: t.association?.name ?? null,
    tipoId: null,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Listagem de Tarefas</h1>
      <DataTable columns={columns} data={tasks} />
    </div>
  );
}
