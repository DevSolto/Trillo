import { prisma } from '@backend/prisma/client'
import { BuscarTarefasInput } from '@backend/shared/validators/buscarTarefas'
import { Prisma } from '@prisma/client'

export async function buscarTarefas({ page, perPage, titulo, statusId, prioridade }: BuscarTarefasInput) {
  const where: Prisma.TarefaWhereInput = {}
  if (titulo) {
    where.titulo = { contains: titulo, mode: 'insensitive' }
  }
  if (statusId) {
    // o campo na tabela é `statusid`, ajustado para refletir o novo schema
    where.statusid = statusId
  }
  if (prioridade) {
    where.prioridade = prioridade
  }

  const [tarefas, total] = await Promise.all([
    prisma.tarefa.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { status: true }
    }),
    prisma.tarefa.count({ where })
  ])

  return { tarefas, total }
}
