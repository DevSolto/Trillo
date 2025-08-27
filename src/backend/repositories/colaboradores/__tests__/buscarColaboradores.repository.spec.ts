import { describe, it, expect, vi } from 'vitest'

vi.mock('@prisma/client', () => {
  class PrismaClientKnownRequestError extends Error {
    code: string
    meta?: unknown
    constructor({ code, meta }: { code: string; meta?: unknown }) {
      super()
      this.code = code
      this.meta = meta
    }
  }
  return {
    prisma: {
      usuario: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0)
      }
    },
    Prisma: { PrismaClientKnownRequestError }
  }
})

import { prisma } from '@prisma/client'
import { buscarColaboradores } from '@/backend/repositories/colaboradores/buscarColaboradores.repository'
import { BuscarColaboradoresInput } from '@/backend/shared/validators/buscarColaboradores'

describe('buscarColaboradores.repository', () => {
  it('chama prisma com filtros e paginacao', async () => {
    await buscarColaboradores({ page: 2, perPage: 5, nome: 'test' } as unknown as BuscarColaboradoresInput)
    expect(prisma.usuario.findMany).toHaveBeenCalledWith({
      where: { funcao: { in: ['COLABORADOR', 'ADM'] }, nome: { contains: 'test', mode: 'insensitive' } },
      select: { id: true, nome: true, funcao: true },
      skip: 5,
      take: 5
    })
    expect(prisma.usuario.count).toHaveBeenCalledWith({
      where: { funcao: { in: ['COLABORADOR', 'ADM'] }, nome: { contains: 'test', mode: 'insensitive' } }
    })
  })
})
