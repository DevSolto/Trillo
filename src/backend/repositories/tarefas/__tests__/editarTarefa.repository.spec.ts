import { describe, it, expect, vi, afterEach } from 'vitest'
import { editarTarefa } from '@/backend/repositories/tarefas/editarTarefa.repository'
import { prisma } from '@/prisma/client'
import { AppError } from '@/backend/shared/errors/app-error'
import type { EditarTarefaInput } from '@/backend/shared/validators/editarTarefa'

vi.mock('@/prisma/client')

describe('editarTarefa.repository', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('atualiza somente os campos fornecidos', async () => {
    const data: EditarTarefaInput = {
      id: '1',
      titulo: 'novo titulo',
      descricao: 'nova descricao'
    }
    vi.mocked(prisma.tarefa.update).mockResolvedValue({ id: '1' } as unknown)

    const result = await editarTarefa(data)

    expect(prisma.tarefa.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        titulo: 'novo titulo',
        descricao: 'nova descricao'
      }
    })
    expect(result).toEqual({ id: '1' })
  })

  it('atualiza responsavel quando existe', async () => {
    const data: EditarTarefaInput = {
      id: '1',
      responsavelId: 'responsavel',
      titulo: 't'
    }
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: 'responsavel' } as unknown)
    vi.mocked(prisma.tarefa.update).mockResolvedValue({ id: '1' } as unknown)

    await editarTarefa(data)

    expect(prisma.tarefa.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        titulo: 't',
        responsavelid: 'responsavel'
      }
    })
  })

  it('lança AppError quando responsavel não existe', async () => {
    const data: EditarTarefaInput = {
      id: '1',
      responsavelId: 'resp-inexistente'
    }

    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(null)

    await expect(editarTarefa(data)).rejects.toBeInstanceOf(AppError)
    expect(prisma.tarefa.update).not.toHaveBeenCalled()
  })
})
