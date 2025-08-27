import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestContext, TestContext } from './utils/testContext'
import { randomUUID } from 'crypto'
import * as criarTarefaUsecaseModule from '@/backend/usecases/tarefas/criarTarefa.usecase'

let ctx: TestContext
let criadorId: string

describe('POST /api/tarefas/criar', () => {
  beforeEach(async () => {
    ctx = await createTestContext()
    criadorId = randomUUID()
    await ctx.prisma.usuario.create({ data: { id: criadorId, nome: 'Criador', funcao: 'ADM' } })
    await ctx.prisma.usuario.create({ data: { id: '00000000-0000-0000-0000-000000000000', nome: 'Resp', funcao: 'COLABORADOR' } })
    await ctx.prisma.associacao.create({ data: { id: '00000000-0000-0000-0000-000000000000', nome: 'Assoc' } })
    await ctx.prisma.tipo.create({ data: { id: '00000000-0000-0000-0000-000000000000', nome: 'Tipo', descricao: 'd', criadorid: criadorId } })
    await ctx.prisma.status.create({ data: { id: '8eb90bc1-244c-4412-bc9f-3c12097a8d83', nome: 'Em andamento', descricao: 'd', criadorid } })
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    await ctx.close()
  })

  it('retorna 201 e cria tarefa', async () => {
    const body = {
      titulo: 't',
      descricao: 'd',
      prioridade: 'alta',
      associacaoId: '00000000-0000-0000-0000-000000000000',
      criadorId: criadorId,
      responsavelId: '00000000-0000-0000-0000-000000000000',
      statusId: null,
      tipoId: '00000000-0000-0000-0000-000000000000',
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString()
    }

    const res = await ctx.request.post('/api/tarefas/criar').send(body)
    expect(res.status).toBe(201)
    const tarefas = await ctx.prisma.tarefa.findMany()
    expect(tarefas).toHaveLength(1)
    expect(tarefas[0].titulo).toBe('t')
  })

  it('retorna 400 para payload inválido', async () => {
    const res = await ctx.request.post('/api/tarefas/criar').send({})
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message')
  })

  it('retorna 500 quando usecase falha', async () => {
    vi.spyOn(criarTarefaUsecaseModule, 'criarTarefaUsecase').mockRejectedValue(
      new Error('fail')
    )
    const body = {
      titulo: 't',
      descricao: 'd',
      prioridade: 'alta',
      associacaoId: '00000000-0000-0000-0000-000000000000',
      criadorId: criadorId,
      responsavelId: '00000000-0000-0000-0000-000000000000',
      statusId: null,
      tipoId: '00000000-0000-0000-0000-000000000000',
      data_inicio: new Date().toISOString(),
      data_fim: new Date().toISOString()
    }
    const res = await ctx.request.post('/api/tarefas/criar').send(body)
    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Internal Server Error')
  })
})
