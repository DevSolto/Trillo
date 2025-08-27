import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@prisma/client')

import { prisma } from '@prisma/client'
import { buscarTarefas } from '@/backend/repositories/tarefas/buscarTarefas.repository'
import { BuscarTarefasInput } from '@/backend/shared/validators/buscarTarefas'

describe('buscarTarefas.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.tarefa.findMany).mockResolvedValue([])
    vi.mocked(prisma.tarefa.count).mockResolvedValue(0)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('chama prisma com filtros e paginacao e retorna tarefas e total', async () => {
    const tarefas = [{ id: '1' } as any]
    vi.mocked(prisma.tarefa.findMany).mockResolvedValue(tarefas)
    vi.mocked(prisma.tarefa.count).mockResolvedValue(tarefas.length)

    const result = await buscarTarefas({ page: 2, perPage: 5, statusId: '1', titulo: 'test', prioridade: 'alta' } as unknown as BuscarTarefasInput)
    expect(prisma.tarefa.findMany).toHaveBeenCalledWith({
      where: { statusid: '1', prioridade: 'alta', titulo: { contains: 'test', mode: 'insensitive' } },
      skip: 5,
      take: 5,
      include: { status: true }
    })
    expect(prisma.tarefa.count).toHaveBeenCalledWith({
      where: { statusid: '1', prioridade: 'alta', titulo: { contains: 'test', mode: 'insensitive' } }
    })
    expect(result).toEqual({ tarefas, total: tarefas.length })
  })

  it('propaga erro se prisma.tarefa.findMany falhar', async () => {
    const error = new Error('db error')
    vi.mocked(prisma.tarefa.findMany).mockRejectedValue(error)
    vi.mocked(prisma.tarefa.count).mockResolvedValue(0)

    await expect(buscarTarefas({ page: 1, perPage: 10 } as unknown as BuscarTarefasInput)).rejects.toThrow(error)
  })
})
