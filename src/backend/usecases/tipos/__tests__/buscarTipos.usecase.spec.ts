import { describe, it, expect, vi } from 'vitest'

vi.mock('@backend/repositories/tipos/buscarTipos.repository', () => ({
  buscarTipos: vi.fn()
}))

import { buscarTipos } from '@backend/repositories/tipos/buscarTipos.repository'
import { buscarTiposUsecase } from '../buscarTipos.usecase'
import { BuscarTiposInput } from '@backend/shared/validators/buscarTipos'

describe('buscarTiposUsecase', () => {
  it('valida dados e chama repositorio', async () => {
    const spy = vi.mocked(buscarTipos)
    spy.mockResolvedValue({ tipos: [], total: 0 })
    await buscarTiposUsecase({ page: '2', perPage: '5', nome: 'abc' } as unknown as BuscarTiposInput)
    expect(spy).toHaveBeenCalledWith({ page: 2, perPage: 5, nome: 'abc' })
  })
})
