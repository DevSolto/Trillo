import { editarTarefa } from '@/backend/repositories/tarefas/editarTarefa.repository'
import { EditarTarefaInput, editarTarefaSchema } from '@/backend/shared/validators/editarTarefa'

export async function editarTarefaUsecase(input: EditarTarefaInput) {
  const data = editarTarefaSchema.parse(input)
  return editarTarefa(data)
}
