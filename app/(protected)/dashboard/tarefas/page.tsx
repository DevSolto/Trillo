import { columns } from "./components/columns"
import tasks from "./data/tasks.json"
import { DataTable } from "./components/data-table"

export default function TarefasPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Listagem de Tarefas</h1>
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
