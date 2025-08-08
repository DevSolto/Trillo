import { buscarTarefas } from '@backend/repositories/tarefas/buscarTarefas.repository'
import { BuscarTarefasInput, buscarTarefasSchema } from '@backend/shared/validators/buscarTarefas'

export async function buscarTarefasUsecase(input: BuscarTarefasInput) {
  const data = buscarTarefasSchema.parse(input)
  return buscarTarefas(data)
}
