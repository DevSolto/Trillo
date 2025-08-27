import { describe, it, expect, vi } from 'vitest'
import { GET } from '@/app/api/tarefas/buscar/route'

vi.mock('@backend/usecases/tarefas/buscarTarefas.usecase', () => {
  return {
    buscarTarefasUsecase: vi.fn().mockResolvedValue({ tarefas: [], total: 0 })
  }
})

import { buscarTarefasUsecase } from '@backend/usecases/tarefas/buscarTarefas.usecase'

describe('GET /api/tarefas/buscar', () => {
  it('retorna 200 e chama usecase', async () => {
    const url = new URL('http://localhost/api/tarefas/buscar?statusId=00000000-0000-0000-0000-000000000000&page=1&perPage=10')
    const req = new Request(url.toString())
    const res = await GET(req as any)
    expect(res.status).toBe(200)
    expect(buscarTarefasUsecase).toHaveBeenCalledWith({
      statusId: '00000000-0000-0000-0000-000000000000',
      page: 1,
      perPage: 10
    })
  })
})

