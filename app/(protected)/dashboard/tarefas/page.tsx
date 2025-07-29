import { columns } from "./components/columns"
import tasks from "./data/tasks.json"
import { DataTable } from "./components/data-table"

export default function TarefasPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Listagem de Tarefas</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Exibindo dados de exemplo a partir do arquivo <code>tasks.json</code>.
      </p>
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
