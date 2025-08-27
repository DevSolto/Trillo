import { vi } from 'vitest'
import { newDb } from 'pg-mem'
import { randomUUID } from 'crypto'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import supertest, { SuperTest, Test } from 'supertest'
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

let pgAdapter: any
vi.mock('pg', () => pgAdapter)

export interface TestContext {
  request: SuperTest<Test>
  prisma: any
  close: () => Promise<void>
}

export async function createTestContext(): Promise<TestContext> {
  const db = newDb({ autoCreateForeignKeyIndices: true })
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: 'uuid',
    implementation: randomUUID
  })

  pgAdapter = db.adapters.createPg()

  const schema = fs.readFileSync(
    path.join(process.cwd(), 'prisma/test-schema.sql'),
    'utf8'
  )
  db.public.none(schema)
  vi.unmock('@prisma/client')
  const require = createRequire(import.meta.url)
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()

  const routes = {
    criarTarefa: await import('@/app/api/tarefas/criar/route'),
    buscarTarefas: await import('@/app/api/tarefas/buscar/route'),
    buscarColaboradores: await import('@/app/api/colaboradores/buscar/route'),
    buscarTipos: await import('@/app/api/tipos/buscar/route')
  }

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const parsed = parse(req.url || '', true)
    const method = req.method || 'GET'

    if (method === 'POST' && parsed.pathname === '/api/tarefas/criar') {
      let body = ''
      req.on('data', chunk => {
        body += chunk
      })
      req.on('end', async () => {
        const nextReq = new Request('http://localhost/api/tarefas/criar', {
          method: 'POST',
          headers: { 'Content-Type': req.headers['content-type'] || 'application/json' },
          body
        })
        const nextRes = await routes.criarTarefa.POST(nextReq as any)
        res.statusCode = nextRes.status
        nextRes.headers.forEach((v, k) => res.setHeader(k, v))
        res.end(await nextRes.text())
      })
      return
    }

    if (method === 'GET' && parsed.pathname === '/api/tarefas/buscar') {
      const nextReq = new Request('http://localhost' + req.url)
      const nextRes = await routes.buscarTarefas.GET(nextReq as any)
      res.statusCode = nextRes.status
      nextRes.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(await nextRes.text())
      return
    }

    if (method === 'GET' && parsed.pathname === '/api/colaboradores/buscar') {
      const nextReq = new Request('http://localhost' + req.url)
      const nextRes = await routes.buscarColaboradores.GET(nextReq as any)
      res.statusCode = nextRes.status
      nextRes.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(await nextRes.text())
      return
    }

    if (method === 'GET' && parsed.pathname === '/api/tipos/buscar') {
      const nextReq = new Request('http://localhost' + req.url)
      const nextRes = await routes.buscarTipos.GET(nextReq as any)
      res.statusCode = nextRes.status
      nextRes.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(await nextRes.text())
      return
    }

    res.statusCode = 404
    res.end()
  })

  const request = supertest(server)

  return {
    request,
    prisma,
    close: async () => {
      await prisma.$disconnect()
      server.close()
      pgAdapter = undefined
      vi.resetModules()
    }
  }
}
