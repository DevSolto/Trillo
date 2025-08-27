import { describe, it, expect, vi } from 'vitest'
import { GET } from '../../app/api/colaboradores/buscar/route'
import { NextRequest } from 'next/server'

vi.mock('@backend/usecases/colaboradores/buscarColaboradores.usecase', () => {
  return {
    buscarColaboradoresUsecase: vi.fn().mockResolvedValue({ colaboradores: [], total: 0 })
  }
})

import { buscarColaboradoresUsecase } from '@backend/usecases/colaboradores/buscarColaboradores.usecase'

describe('GET /api/colaboradores/buscar', () => {
  it('retorna 200 e chama usecase', async () => {
    const url = new URL('http://localhost/api/colaboradores/buscar?page=1&perPage=10&nome=joao')
    const req = new Request(url.toString())
    const res = await GET(req as unknown as NextRequest)
    expect(res.status).toBe(200)
    expect(buscarColaboradoresUsecase).toHaveBeenCalledWith({
      page: 1,
      perPage: 10,
      nome: 'joao'
    })
  })
})

