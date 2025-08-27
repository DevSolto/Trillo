import { prisma, Prisma } from '@/prisma/client'
import { BuscarColaboradoresInput } from '@/backend/shared/validators/buscarColaboradores'

export async function buscarColaboradores({ page, perPage, nome }: BuscarColaboradoresInput) {
  const where: Prisma.UsuarioWhereInput = { funcao: { in: ['COLABORADOR', 'ADM'] } }
  if (nome) {
    where.nome = { contains: nome, mode: 'insensitive' }
  }

  const [colaboradores, total] = await Promise.all([
    prisma.usuario.findMany({
      where,
      select: { id: true, nome: true, funcao: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.usuario.count({ where })
  ])

  return { colaboradores, total }
}
