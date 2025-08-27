import { prisma, Prisma } from '@/prisma/client'
import { AppError } from '@/backend/shared/errors/app-error'

export async function deletarTarefa(id: string) {
  try {
    return await prisma.tarefa.delete({ where: { id } })
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Tarefa não encontrada')
    }
    throw error
  }
}
