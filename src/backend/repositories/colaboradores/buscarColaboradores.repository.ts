import { prisma } from '@backend/prisma/client'
import { BuscarColaboradoresInput } from '@backend/shared/validators/buscarColaboradores'

export async function buscarColaboradores({ page, perPage, nome }: BuscarColaboradoresInput) {
  const where: any = { funcao: 'COLABORADOR' }
  if (nome) {
    where.nome = { contains: nome, mode: 'insensitive' }
  }

  const [colaboradores, total] = await Promise.all([
    prisma.usuario.findMany({ where, skip: (page - 1) * perPage, take: perPage }),
    prisma.usuario.count({ where })
  ])

  return { colaboradores, total }
}
