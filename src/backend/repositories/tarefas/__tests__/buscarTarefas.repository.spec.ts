import { describe, it, expect, vi } from 'vitest'

vi.mock('@backend/prisma/client', () => ({
  prisma: {
    tarefa: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0)
    }
  }
}))

import { prisma } from '@backend/prisma/client'
import { buscarTarefas } from '../buscarTarefas.repository'

describe('buscarTarefas.repository', () => {
  it('chama prisma com filtros e paginacao', async () => {
    await buscarTarefas({ page: 2, perPage: 5, statusId: '1', titulo: 'test', prioridade: 'alta' } as any)
    expect(prisma.tarefa.findMany).toHaveBeenCalledWith({
      where: { statusId: '1', prioridade: 'alta', titulo: { contains: 'test', mode: 'insensitive' } },
      skip: 5,
      take: 5,
      include: { status: true }
    })
    expect(prisma.tarefa.count).toHaveBeenCalledWith({
      where: { statusId: '1', prioridade: 'alta', titulo: { contains: 'test', mode: 'insensitive' } }
    })
  })
})
