import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@/prisma/client')

import { prisma } from '@/prisma/client'
import { buscarTipos } from '@/backend/repositories/tipos/buscarTipos.repository'
import { BuscarTiposInput } from '@/backend/shared/validators/buscarTipos'

describe('buscarTipos.repository', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('chama prisma com filtros e paginacao', async () => {
    vi.mocked(prisma.tipo.findMany).mockResolvedValue([])
    vi.mocked(prisma.tipo.count).mockResolvedValue(0)

    await buscarTipos({ page: 2, perPage: 5, nome: 'test' } as unknown as BuscarTiposInput)
    expect(prisma.tipo.findMany).toHaveBeenCalledWith({
      where: { nome: { contains: 'test', mode: 'insensitive' } },
      skip: 5,
      take: 5
    })
    expect(prisma.tipo.count).toHaveBeenCalledWith({
      where: { nome: { contains: 'test', mode: 'insensitive' } }
    })
  })
})
