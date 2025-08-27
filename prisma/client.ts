import type { Prisma as PrismaTypes, PrismaClient as PrismaClientType } from '@prisma/client'
import PrismaPkg from '@prisma/client'

// garante compat CJS/ESM
const { PrismaClient, Prisma } = PrismaPkg as unknown as {
  PrismaClient: new (...args: any[]) => PrismaClientType
  Prisma: typeof PrismaTypes
}

declare global {
  // eslint-disable-next-line no-var
  var __PRISMA__: PrismaClientType | undefined
}

export const prisma: PrismaClientType =
  globalThis.__PRISMA__ ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.__PRISMA__ = prisma

export { Prisma }
