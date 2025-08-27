import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createTestContext, TestContext } from './utils/testContext'
import { randomUUID } from 'crypto'

let ctx: TestContext

describe('GET /api/colaboradores/buscar', () => {
  beforeEach(async () => {
    ctx = await createTestContext()
    await ctx.prisma.usuario.create({ data: { id: randomUUID(), nome: 'Joao', funcao: 'COLABORADOR' } })
    await ctx.prisma.usuario.create({ data: { id: randomUUID(), nome: 'Maria', funcao: 'ADM' } })
  })

  afterEach(async () => {
    await ctx.close()
  })

  it('retorna 200 e lista colaboradores', async () => {
    const res = await ctx.request.get('/api/colaboradores/buscar?page=1&perPage=10&nome=joao')
    expect(res.status).toBe(200)
    expect(res.body.colaboradores).toHaveLength(1)
    expect(res.body.colaboradores[0].nome).toBe('Joao')
  })
})
