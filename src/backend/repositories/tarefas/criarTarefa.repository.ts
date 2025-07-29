import { prisma } from '@backend/prisma/client'
import { TarefaInput } from '@backend/shared/validators/tarefa'

export function criarTarefa(data: TarefaInput) {
  return prisma.tarefa.create({ data })
}
