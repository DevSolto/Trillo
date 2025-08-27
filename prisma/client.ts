/* eslint-disable @typescript-eslint/no-var-requires */
// Import PrismaClient dynamically to avoid path alias conflicts
const { PrismaClient } = require('@' + 'prisma/client') as any

export const prisma = new PrismaClient()
