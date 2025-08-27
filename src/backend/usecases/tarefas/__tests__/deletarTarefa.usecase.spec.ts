import { describe, it, expect, vi } from 'vitest'

vi.mock('@backend/repositories/tarefas/deletarTarefa.repository', () => ({
  deletarTarefa: vi.fn()
}))

import { deletarTarefa } from '@backend/repositories/tarefas/deletarTarefa.repository'
import { deletarTarefaUsecase } from '../deletarTarefa.usecase'

describe('deletarTarefaUsecase', () => {
  it('valida dados e chama repositorio', async () => {
    const spy = vi.mocked(deletarTarefa)
    spy.mockResolvedValue({} as unknown)
    await deletarTarefaUsecase({ id: '00000000-0000-0000-0000-000000000000' })
    expect(spy).toHaveBeenCalledWith('00000000-0000-0000-0000-000000000000')
  })
})
