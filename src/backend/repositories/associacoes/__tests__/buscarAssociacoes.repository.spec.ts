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
      associacao: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0)
      }
    },
    Prisma: { PrismaClientKnownRequestError }
  }
})

import { prisma } from '@prisma/client'
import { buscarAssociacoes } from '@/backend/repositories/associacoes/buscarAssociacoes.repository'
import { BuscarAssociacoesInput } from '@/backend/shared/validators/buscarAssociacoes'

describe('buscarAssociacoes.repository', () => {
  it('chama prisma com filtros e paginacao', async () => {
    await buscarAssociacoes({ page: 2, perPage: 5, nome: 'test', cidade: 'city', estado: 'SP' } as unknown as BuscarAssociacoesInput)
    expect(prisma.associacao.findMany).toHaveBeenCalledWith({
      where: {
        nome: { contains: 'test', mode: 'insensitive' },
        cidade: { contains: 'city', mode: 'insensitive' },
        estado: 'SP'
      },
      skip: 5,
      take: 5
    })
    expect(prisma.associacao.count).toHaveBeenCalledWith({
      where: {
        nome: { contains: 'test', mode: 'insensitive' },
        cidade: { contains: 'city', mode: 'insensitive' },
        estado: 'SP'
      }
    })
  })
})
