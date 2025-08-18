import { describe, it, expect, vi } from 'vitest'

vi.mock('@backend/repositories/tarefas/criarTarefa.repository', () => ({
  criarTarefa: vi.fn()
}))

import { criarTarefa } from '@backend/repositories/tarefas/criarTarefa.repository'
import { criarTarefaUsecase } from '../criarTarefa.usecase'

describe('criarTarefaUsecase', () => {
  it('valida dados e chama repositorio', async () => {
    const spy = vi.mocked(criarTarefa)
    spy.mockResolvedValue({ id: '1' } as any)
    await criarTarefaUsecase({
      titulo: 't',
      descricao: 'd',
      prioridade: 'alta',
      associacaoId: '00000000-0000-0000-0000-000000000000',
      criadorId: '00000000-0000-0000-0000-000000000000',
      responsavelId: '00000000-0000-0000-0000-000000000000',
      statusId: null,
      tipoId: '00000000-0000-0000-0000-000000000000',
      data_inicio: new Date(),
      data_fim: new Date()
    })
    expect(spy).toHaveBeenCalled()
  })
})
