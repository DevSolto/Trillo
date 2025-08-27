import { vi } from 'vitest'

class PrismaClientKnownRequestError extends Error {
  code: string
  meta?: unknown
  constructor({ code, meta }: { code: string; meta?: unknown }) {
    super()
    this.code = code
    this.meta = meta
  }
}

export const Prisma = { PrismaClientKnownRequestError }

export class PrismaClient {
  tipo = {
    findMany: vi.fn(),
    count: vi.fn()
  }

  usuario = {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn()
  }

  tarefa = {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn()
  }

  associacao = {
    findMany: vi.fn(),
    count: vi.fn()
  }
}

export const prisma = new PrismaClient()
