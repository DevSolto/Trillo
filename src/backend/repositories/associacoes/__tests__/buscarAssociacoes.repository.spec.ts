import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@/prisma/client')

import { prisma } from '@/prisma/client'
import { buscarAssociacoes } from '@/backend/repositories/associacoes/buscarAssociacoes.repository'
import { BuscarAssociacoesInput } from '@/backend/shared/validators/buscarAssociacoes'

describe('buscarAssociacoes.repository', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('chama prisma com filtros e paginacao', async () => {
    vi.mocked(prisma.associacao.findMany).mockResolvedValue([])
    vi.mocked(prisma.associacao.count).mockResolvedValue(0)

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
