import { columns, Task } from "./components/columns"
import { DataTable } from "./components/data-table"

export default async function TarefasPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  let tarefas: any[] = []
  let associacoes: any[] = []
  try {
    const [tarefasRes, associacoesRes] = await Promise.all([
      fetch(`${baseUrl}/api/tarefas/buscar`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/associacoes/buscar?page=1&perPage=100`, { cache: "no-store" }),
    ])

    if (tarefasRes.ok) {
      const data = await tarefasRes.json()
      tarefas = data?.tarefas ?? []
    }

    if (associacoesRes.ok) {
      const data = await associacoesRes.json()
      associacoes = data?.associacoes ?? []
    }
  } catch (error) {
    console.error("Erro ao buscar tarefas", error)
  }

  const associacoesMap = Object.fromEntries(
    associacoes.map((a: any) => [a.id, a.nome])
  )

  const tasks: Task[] = (tarefas ?? []).map((t: any) => ({
    id: t.id,
    createdAt: t.createdat,
    title: t.titulo,
    description: t.descricao,
    status: t.status?.nome ?? null,
    label: t.tipoid ?? null,
    priority: t.prioridade ?? null,
    endDate: t.data_fim ?? null,
    responsavelId: t.responsavelid ?? null,
    associacaoId: t.associacaoid ?? null,
    associacao: associacoesMap[t.associacaoid] ?? null,
    tipoId: t.tipoid ?? null,
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Listagem de Tarefas</h1>
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
