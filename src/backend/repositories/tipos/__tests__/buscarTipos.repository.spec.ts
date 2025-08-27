import { describe, it, expect, vi } from 'vitest'

vi.mock('@backend/prisma/client', () => ({
  prisma: {
    tipo: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0)
    }
  }
}))

import { prisma } from '@backend/prisma/client'
import { buscarTipos } from '../buscarTipos.repository'
import { BuscarTiposInput } from '@backend/shared/validators/buscarTipos'

describe('buscarTipos.repository', () => {
  it('chama prisma com filtros e paginacao', async () => {
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
