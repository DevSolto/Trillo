import { describe, it, expect, vi } from 'vitest'

vi.mock('@/backend/repositories/associacoes/buscarAssociacoes.repository', () => ({
  buscarAssociacoes: vi.fn(),
}))

import { buscarAssociacoes } from '@/backend/repositories/associacoes/buscarAssociacoes.repository'
import { buscarAssociacoesUsecase } from '@/backend/usecases/associacoes/buscarAssociacoes.usecase'
import { BuscarAssociacoesInput } from '@/backend/shared/validators/buscarAssociacoes'

describe('buscarAssociacoesUsecase', () => {
  it('valida dados e chama repositorio', async () => {
    const spy = vi.mocked(buscarAssociacoes)
    spy.mockResolvedValue({ associacoes: [], total: 0 })
    await buscarAssociacoesUsecase({
      page: '2',
      perPage: '5',
      nome: 'abc',
      cidade: 'xyz',
      estado: 'SP'
    } as unknown as BuscarAssociacoesInput)
    expect(spy).toHaveBeenCalledWith({
      page: 2,
      perPage: 5,
      nome: 'abc',
      cidade: 'xyz',
      estado: 'SP'
    })
  })
})
