import { columns, Task } from "./components/columns"
import { DataTable } from "./components/data-table"

export default async function TarefasPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  let tarefas: any[] = []
  try {
    const res = await fetch(`${baseUrl}/api/tarefas/buscar`, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      tarefas = data?.tarefas ?? []
    }
  } catch (error) {
    console.error("Erro ao buscar tarefas", error)
  }

  const tasks: Task[] = (tarefas ?? []).map((t: any) => ({
    id: t.id,
    createdAt: t.createdat,
    title: t.titulo,
    status: t.statusid ?? null,
    label: t.tipoid ?? null,
    priority: t.prioridade ?? null,
    endDate: t.data_fim ?? null,
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Listagem de Tarefas</h1>
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
