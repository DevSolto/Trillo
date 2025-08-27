import { prisma } from '@backend/prisma/client'
import { BuscarTiposInput } from '@backend/shared/validators/buscarTipos'
import { Prisma } from '@prisma/client'

export async function buscarTipos({ page, perPage, nome }: BuscarTiposInput) {
  const where: Prisma.TipoWhereInput = {}
  if (nome) {
    where.nome = { contains: nome, mode: 'insensitive' }
  }

  const [tipos, total] = await Promise.all([
    prisma.tipo.findMany({ where, skip: (page - 1) * perPage, take: perPage }),
    prisma.tipo.count({ where })
  ])

  return { tipos, total }
}
