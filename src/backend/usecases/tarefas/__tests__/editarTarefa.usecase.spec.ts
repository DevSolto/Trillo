import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@/backend/repositories/tarefas/editarTarefa.repository', () => ({
  editarTarefa: vi.fn()
}))

import { editarTarefa } from '@/backend/repositories/tarefas/editarTarefa.repository'
import { editarTarefaUsecase } from '@/backend/usecases/tarefas/editarTarefa.usecase'
import type { EditarTarefaInput } from '@/backend/shared/validators/editarTarefa'

describe('editarTarefaUsecase', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('valida dados e chama repositorio', async () => {
    const spy = vi.mocked(editarTarefa)
    spy.mockResolvedValue({} as unknown)
    await editarTarefaUsecase({
      id: '00000000-0000-0000-0000-000000000000',
      titulo: 't'
    } as EditarTarefaInput)
    expect(spy).toHaveBeenCalledWith({
      id: '00000000-0000-0000-0000-000000000000',
      titulo: 't'
    })
  })

  it('lança erro para input inválido', async () => {
    const spy = vi.mocked(editarTarefa)
    await expect(
      editarTarefaUsecase({ id: 'invalid' } as EditarTarefaInput)
    ).rejects.toThrowError()
    expect(spy).not.toHaveBeenCalled()
  })
})

