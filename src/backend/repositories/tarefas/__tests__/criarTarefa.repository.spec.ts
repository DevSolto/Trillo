import { describe, it, expect, vi } from 'vitest'
import { criarTarefa } from '../criarTarefa.repository'
import { prisma } from '@backend/prisma/client'

vi.mock('@backend/prisma/client', () => {
  return { prisma: { tarefa: { create: vi.fn().mockResolvedValue({ id: '1' }) } } }
})

describe('criarTarefa.repository', () => {
  it('insere tarefa com prisma', async () => {
    const data: any = { titulo: 't' }
    const result = await criarTarefa(data)
    expect(prisma.tarefa.create).toHaveBeenCalledWith({ data })
    expect(result).toEqual({ id: '1' })
  })
})
