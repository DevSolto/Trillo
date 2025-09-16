// app/(private)/tarefas/page.tsx
import { columns, type Task } from './components/columns';
import { DataTable } from './components/DataTable';
import { Kanban } from './components/Kanban';
import { ViewToggle } from './components/ViewToggle';
import { listTasksServer } from '@/services/tarefas/list-tasks';

// Dados vêm do backend externo via proxy /api, usando serviço SSR.

export default async function TarefasPage({
  searchParams,
}: {
  // Next.js 15: searchParams can be async; handle both
  searchParams?: any;
}) {
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
    priority: (t as any).priority ?? null,
    endDate: t.dueDate ?? null,
    responsavelId: t.team?.[0]?.id ?? null,
    teamIds: Array.isArray(t.team) ? t.team.map((u) => u.id) : [],
    associacaoId: t.association?.id ?? null,
    associacao: t.association?.name ?? null,
    tipoId: null,
  }));

  // Normalize search params (supports Promise, URLSearchParams, or plain object)
  const sp: any = await searchParams;
  const viewParam =
    typeof sp?.get === 'function'
      ? sp.get('view')
      : Array.isArray(sp?.view)
        ? sp.view[0]
        : sp?.view;
  const view = viewParam === 'table' ? 'table' : 'kanban';

  return (
    <div className="p-6 max-h-full">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Tarefas</h1>
        <div className="ml-auto">
          <ViewToggle view={view} />
        </div>
      </div>

      {view === 'kanban' ? (
        <Kanban tasks={tasks} />
      ) : (
        <DataTable columns={columns} data={tasks} />
      )}
    </div>
  );
}
