import { criarTarefa } from '@/backend/repositories/tarefas/criarTarefa.repository'
import { TarefaInput, tarefaSchema } from '@/backend/shared/validators/tarefa'

export async function criarTarefaUsecase(input: TarefaInput) {
  const data = tarefaSchema.parse(input)
  return criarTarefa(data)
}
