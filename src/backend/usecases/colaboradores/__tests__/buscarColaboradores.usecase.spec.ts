import { describe, it, expect, vi } from 'vitest'

vi.mock('@backend/repositories/colaboradores/buscarColaboradores.repository', () => ({
  buscarColaboradores: vi.fn()
}))

import { buscarColaboradores } from '@backend/repositories/colaboradores/buscarColaboradores.repository'
import { buscarColaboradoresUsecase } from '../buscarColaboradores.usecase'

describe('buscarColaboradoresUsecase', () => {
  it('valida dados e chama repositorio', async () => {
    const spy = vi.mocked(buscarColaboradores)
    spy.mockResolvedValue({ colaboradores: [], total: 0 })
    await buscarColaboradoresUsecase({ page: '2', perPage: '5', nome: 'abc' } as any)
    expect(spy).toHaveBeenCalledWith({ page: 2, perPage: 5, nome: 'abc' })
  })
})
