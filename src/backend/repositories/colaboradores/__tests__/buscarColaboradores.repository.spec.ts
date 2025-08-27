import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@prisma/client')

import { prisma } from '@prisma/client'
import { buscarColaboradores } from '@/backend/repositories/colaboradores/buscarColaboradores.repository'
import { BuscarColaboradoresInput } from '@/backend/shared/validators/buscarColaboradores'

describe('buscarColaboradores.repository', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('chama prisma com filtros e paginacao', async () => {
    vi.mocked(prisma.usuario.findMany).mockResolvedValue([])
    vi.mocked(prisma.usuario.count).mockResolvedValue(0)

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
