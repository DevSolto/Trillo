
import { TarefaInput } from '@backend/shared/validators/tarefa'
import { prisma } from '@backend/prisma/client'

export function criarTarefa(data: TarefaInput) {
  return prisma.tarefa.create({ data })
}
