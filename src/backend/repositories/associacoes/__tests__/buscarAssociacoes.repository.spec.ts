import { describe, it, expect, vi } from 'vitest'

vi.mock('@prisma/client', () => ({
  prisma: {
    associacao: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0)
    }
  }
}))

import { prisma } from '@prisma/client'
import { buscarAssociacoes } from '../buscarAssociacoes.repository'

describe('buscarAssociacoes.repository', () => {
  it('chama prisma com filtros e paginacao', async () => {
    await buscarAssociacoes({ page: 2, perPage: 5, nome: 'test', cidade: 'city', estado: 'SP' } as any)
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
