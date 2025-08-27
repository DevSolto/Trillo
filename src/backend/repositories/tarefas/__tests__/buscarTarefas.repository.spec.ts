import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@prisma/client')

import { prisma } from '@prisma/client'
import { buscarTarefas } from '@/backend/repositories/tarefas/buscarTarefas.repository'
import { BuscarTarefasInput } from '@/backend/shared/validators/buscarTarefas'

describe('buscarTarefas.repository', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('chama prisma com filtros e paginacao', async () => {
    vi.mocked(prisma.tarefa.findMany).mockResolvedValue([])
    vi.mocked(prisma.tarefa.count).mockResolvedValue(0)

    await buscarTarefas({ page: 2, perPage: 5, statusId: '1', titulo: 'test', prioridade: 'alta' } as unknown as BuscarTarefasInput)
    expect(prisma.tarefa.findMany).toHaveBeenCalledWith({
      where: { statusid: '1', prioridade: 'alta', titulo: { contains: 'test', mode: 'insensitive' } },
      skip: 5,
      take: 5,
      include: { status: true }
    })
    expect(prisma.tarefa.count).toHaveBeenCalledWith({
      where: { statusid: '1', prioridade: 'alta', titulo: { contains: 'test', mode: 'insensitive' } }
    })
  })
})
