import { prisma } from '@prisma/client'
import { BuscarAssociacoesInput } from '@/backend/shared/validators/buscarAssociacoes'
import { Prisma } from '@prisma/client'

export async function buscarAssociacoes({ page, perPage, nome, cidade, estado }: BuscarAssociacoesInput) {
  const where: Prisma.AssociacaoWhereInput = {}
  if (nome) {
    where.nome = { contains: nome, mode: 'insensitive' }
  }
  if (cidade) {
    where.cidade = { contains: cidade, mode: 'insensitive' }
  }
  if (estado) {
    where.estado = estado
  }

  const [associacoes, total] = await Promise.all([
    prisma.associacao.findMany({ where, skip: (page - 1) * perPage, take: perPage }),
    prisma.associacao.count({ where })
  ])

  return { associacoes, total }
}
