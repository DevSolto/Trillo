import { prisma } from '@backend/prisma/client'
import type { Prisma } from '@prisma/client'

export function criarTarefa(data: Prisma.TarefaCreateInput) {
  return prisma.tarefa.create({ data })
}
