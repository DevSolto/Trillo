import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createTestContext, TestContext } from './utils/testContext'
import { randomUUID } from 'crypto'

let ctx: TestContext
let criadorId: string

describe('GET /api/tipos/buscar', () => {
  beforeEach(async () => {
    ctx = await createTestContext()
    criadorId = randomUUID()
    await ctx.prisma.usuario.create({ data: { id: criadorId, nome: 'User', funcao: 'ADM' } })
    await ctx.prisma.tipo.create({ data: { id: randomUUID(), nome: 'Suporte', descricao: 'd', criadorid: criadorId } })
    await ctx.prisma.tipo.create({ data: { id: randomUUID(), nome: 'Feature', descricao: 'd', criadorid: criadorId } })
  })

  afterEach(async () => {
    await ctx?.close()
  })

  it('retorna 200 e filtra tipos', async () => {
    const res = await ctx.request.get('/api/tipos/buscar?nome=sup&page=1&perPage=10')
    expect(res.status).toBe(200)
    expect(res.body.tipos).toHaveLength(1)
    expect(res.body.tipos[0].nome).toBe('Suporte')
  })
})
