import { describe, it, expect, vi } from 'vitest'

import { GET } from '@/app/api/tipos/buscar/route'
import { NextRequest } from 'next/server'

vi.mock('@/backend/usecases/tipos/buscarTipos.usecase', () => {
  return {
    buscarTiposUsecase: vi.fn().mockResolvedValue({ tipos: [], total: 0 })
  }
})

import { buscarTiposUsecase } from '@/backend/usecases/tipos/buscarTipos.usecase'

describe('GET /api/tipos/buscar', () => {
  it('retorna 200 e chama usecase', async () => {
    const url = new URL('http://localhost/api/tipos/buscar?nome=abc&page=1&perPage=10')
    const req = new Request(url.toString())
    const res = await GET(req as unknown as NextRequest)
    expect(res.status).toBe(200)
    expect(buscarTiposUsecase).toHaveBeenCalledWith({
      nome: 'abc',
      page: 1,
      perPage: 10
    })
  })
})

