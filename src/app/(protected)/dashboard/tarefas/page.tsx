// app/(private)/tarefas/page.tsx
import { columns, type Task } from "./components/columns"
import { DataTable } from "./components/data-table"

// Helper robusto para JSON
async function fetchJSON<T>(url: string) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { accept: "application/json" },
  })

  const ct = res.headers.get("content-type") || ""
  const text = await res.text()

  if (!res.ok) {
    console.error(`[fetchJSON] ${url} -> HTTP ${res.status}`, text.slice(0, 300))
    throw new Error(`HTTP ${res.status} on ${url}`)
  }

  if (!ct.includes("application/json")) {
    console.error(`[fetchJSON] ${url} -> Non-JSON content-type: ${ct}; preview:`, text.slice(0, 200))
    throw new Error(`Non-JSON response from ${url}`)
  }

  try {
    return JSON.parse(text) as T
  } catch (e: unknown) {
    console.error(`[fetchJSON] ${url} -> Invalid JSON; preview:`, text.slice(0, 200))
    throw e
  }
}

export default async function TarefasPage() {
  interface TarefaApi {
    id: string
    createdat: string
    titulo: string
    descricao: string
    status?: { nome: string } | null
    prioridade?: string | null
    data_fim?: string | null
    responsavelid?: string | null
    associacaoid?: string | null
    tipoid?: string | null
  }

  interface AssociacaoApi {
    id: string
    nome: string
  }

  let tarefas: TarefaApi[] = []
  let associacoes: AssociacaoApi[] = []

  try {
    // Use rotas relativas pra aproveitar sessão/cookies e evitar CORS
    const [tarefasData, associacoesData] = await Promise.all([
      fetchJSON<{ tarefas?: TarefaApi[] }>("/api/tarefas/buscar"),
      fetchJSON<{ associacoes?: AssociacaoApi[] }>("/api/associacoes/buscar?page=1&perPage=100"),
    ])

    tarefas = tarefasData?.tarefas ?? []
    associacoes = associacoesData?.associacoes ?? []
  } catch (error: unknown) {
    console.error("Erro ao buscar dados de tarefas/associações:", error)
    // segue com arrays vazios pra não quebrar a página
  }

  const associacoesMap = Object.fromEntries(
    (associacoes ?? []).map((a: AssociacaoApi) => [a.id, a.nome])
  )

  const tasks: Task[] = (tarefas ?? []).map((t: TarefaApi) => ({
    id: t.id,
    createdAt: t.createdat,           // confira o nome exato que a API retorna (created_at vs createdat)
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
