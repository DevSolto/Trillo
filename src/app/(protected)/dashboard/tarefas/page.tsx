import { columns, Task } from "./components/columns"
import { DataTable } from "./components/data-table"

export default async function TarefasPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/tarefas/buscar`, { cache: "no-store" })
  const { tarefas } = await res.json()

  const tasks: Task[] = (tarefas ?? []).map((t: any) => ({
    id: t.id,
    title: t.titulo,
    status: t.statusid ?? null,
    label: t.tipoid ?? null,
    priority: t.prioridade ?? null,
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Listagem de Tarefas</h1>
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
