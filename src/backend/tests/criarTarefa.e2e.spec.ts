import { describe, it, expect, vi } from 'vitest'

import { POST } from '../../app/api/tarefas/criar/route'
import { NextRequest } from 'next/server'

vi.mock('@backend/usecases/tarefas/criarTarefa.usecase', () => {
  return { criarTarefaUsecase: vi.fn().mockResolvedValue({ id: '1' }) }
})

describe('POST /api/tarefas/criar', () => {
  it('retorna 201', async () => {
    const body = {
      titulo: 't',
      descricao: 'd',
      prioridade: 'alta',
      associacaoId: '00000000-0000-0000-0000-000000000000',
      criadorId: '00000000-0000-0000-0000-000000000000',
      responsavelId: '00000000-0000-0000-0000-000000000000',
      statusId: null,
      tipoId: '00000000-0000-0000-0000-000000000000',
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString()
    }
    const req = new Request('http://localhost/api/tarefas/criar', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    const res = await POST(req as unknown as NextRequest)
    expect(res.status).toBe(201)
  })
})

