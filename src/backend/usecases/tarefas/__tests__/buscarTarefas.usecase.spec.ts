import { describe, it, expect, vi } from 'vitest'

vi.mock('@backend/repositories/tarefas/buscarTarefas.repository', () => ({
  buscarTarefas: vi.fn()
}))

import { buscarTarefas } from '@backend/repositories/tarefas/buscarTarefas.repository'
import { buscarTarefasUsecase } from '../buscarTarefas.usecase'

describe('buscarTarefasUsecase', () => {
  it('valida dados e chama repositorio', async () => {
    const spy = vi.mocked(buscarTarefas)
    spy.mockResolvedValue({ tarefas: [], total: 0 })
    await buscarTarefasUsecase({
      page: '2',
      perPage: '5',
      statusId: '00000000-0000-0000-0000-000000000000',
      titulo: 'abc'
    } as any)
    expect(spy).toHaveBeenCalledWith({
      page: 2,
      perPage: 5,
      statusId: '00000000-0000-0000-0000-000000000000',
      titulo: 'abc'
    })
  })
})
