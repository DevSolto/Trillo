import { describe, it, expect, vi, afterEach } from 'vitest'
import { deletarTarefa } from '@/backend/repositories/tarefas/deletarTarefa.repository'
import { prisma, Prisma } from '@/prisma/client'
import { AppError } from '@/backend/shared/errors/app-error'

vi.mock('@/prisma/client')

describe('deletarTarefa.repository', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('deleta tarefa pelo id', async () => {
    vi.mocked(prisma.tarefa.delete).mockResolvedValue({ id: '1' } as unknown)
    const result = await deletarTarefa('1')
    expect(prisma.tarefa.delete).toHaveBeenCalledWith({ where: { id: '1' } })
    expect(result).toEqual({ id: '1' })
  })

  it('lança AppError quando tarefa não existe', async () => {
    const error = new Prisma.PrismaClientKnownRequestError({ code: 'P2025' })
    vi.mocked(prisma.tarefa.delete).mockRejectedValue(error as unknown)
    await expect(deletarTarefa('1')).rejects.toBeInstanceOf(AppError)
  })
})
