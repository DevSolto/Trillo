import { describe, it, expect, vi } from 'vitest'
import { POST } from '../../app/api/tarefas/criar/route'

vi.mock('@backend/usecases/tarefas/criarTarefa.usecase', () => {
  return { criarTarefaUsecase: vi.fn().mockResolvedValue({ id: '1' }) }
})

describe('POST /api/tarefas/criar', () => {
  it('retorna 201', async () => {
    const req = new Request('http://localhost/api/tarefas/criar', {
      method: 'POST',
      body: JSON.stringify({ titulo: 't' }),
      headers: { 'Content-Type': 'application/json' }
    })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })
})
