import { deletarTarefa } from '@backend/repositories/tarefas/deletarTarefa.repository'
import { DeletarTarefaInput, deletarTarefaSchema } from '@backend/shared/validators/deletarTarefa'

export async function deletarTarefaUsecase(input: DeletarTarefaInput) {
  const { id } = deletarTarefaSchema.parse(input)
  return deletarTarefa(id)
}
