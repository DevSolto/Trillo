import { describe, it, expect, vi } from 'vitest'
import { deletarTarefa } from '../deletarTarefa.repository'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

vi.mock('@backend/prisma/client', () => ({
  prisma: {
    tarefa: { delete: vi.fn() }
  }
}))

describe('deletarTarefa.repository', () => {
  it('deleta tarefa pelo id', async () => {
    vi.mocked(prisma.tarefa.delete).mockResolvedValue({ id: '1' } as any)
    const result = await deletarTarefa('1')
    expect(prisma.tarefa.delete).toHaveBeenCalledWith({ where: { id: '1' } })
    expect(result).toEqual({ id: '1' })
  })

  it('lança AppError quando tarefa não existe', async () => {
    const error = { code: 'P2025' }
    vi.mocked(prisma.tarefa.delete).mockRejectedValue(error as any)
    await expect(deletarTarefa('1')).rejects.toBeInstanceOf(AppError)
  })
})
