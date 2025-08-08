import { prisma } from '@backend/prisma/client'
import { BuscarTarefasInput } from '@backend/shared/validators/buscarTarefas'

export async function buscarTarefas({ page, perPage, titulo, statusId, prioridade }: BuscarTarefasInput) {
  const where: any = {}
  if (titulo) {
    where.titulo = { contains: titulo, mode: 'insensitive' }
  }
  if (statusId) {
    where.statusId = statusId
  }
  if (prioridade) {
    where.prioridade = prioridade
  }

  const [tarefas, total] = await Promise.all([
    prisma.tarefa.findMany({ where, skip: (page - 1) * perPage, take: perPage }),
    prisma.tarefa.count({ where })
  ])

  return { tarefas, total }
}
