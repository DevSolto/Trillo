import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestContext, TestContext } from './utils/testContext'
import { randomUUID } from 'crypto'
import * as buscarTarefasUsecaseModule from '@/backend/usecases/tarefas/buscarTarefas.usecase'

let ctx: TestContext
let userId: string

const STATUS_ID = '8eb90bc1-244c-4412-bc9f-3c12097a8d83'

describe('GET /api/tarefas/buscar', () => {
  beforeEach(async () => {
    ctx = await createTestContext()
    userId = randomUUID()
    await ctx.prisma.usuario.create({ data: { id: userId, nome: 'Criador', funcao: 'ADM' } })
    await ctx.prisma.usuario.create({ data: { id: '00000000-0000-0000-0000-000000000000', nome: 'Resp', funcao: 'COLABORADOR' } })
    await ctx.prisma.associacao.create({ data: { id: '00000000-0000-0000-0000-000000000000', nome: 'Assoc' } })
    await ctx.prisma.tipo.create({ data: { id: '00000000-0000-0000-0000-000000000000', nome: 'Tipo', descricao: 'd', criadorid: userId } })
    await ctx.prisma.status.create({ data: { id: STATUS_ID, nome: 'Em andamento', descricao: 'd', criadorid: userId } })
    await ctx.prisma.tarefa.create({
      data: {
        id: randomUUID(),
        titulo: 't',
        descricao: 'd',
        prioridade: 'alta',
        associacaoid: '00000000-0000-0000-0000-000000000000',
        criadorid: userId,
        responsavelid: '00000000-0000-0000-0000-000000000000',
        statusid: STATUS_ID,
        tipoid: '00000000-0000-0000-0000-000000000000',
        data_inicio: new Date(),
        data_fim: new Date()
      }
    })
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    await ctx.close()
  })

  it('retorna 200 e lista tarefas', async () => {
    const res = await ctx.request.get(`/api/tarefas/buscar?statusId=${STATUS_ID}&page=1&perPage=10`)
    expect(res.status).toBe(200)
    expect(res.body.tarefas).toHaveLength(1)
    expect(res.body.tarefas[0].titulo).toBe('t')
  })

  it('retorna 500 quando usecase falha', async () => {
    vi.spyOn(buscarTarefasUsecaseModule, 'buscarTarefasUsecase').mockRejectedValue(
      new Error('fail')
    )
    const res = await ctx.request.get(`/api/tarefas/buscar?statusId=${STATUS_ID}&page=1&perPage=10`)
    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Internal Server Error')
  })
})
