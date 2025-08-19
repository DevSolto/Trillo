import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

export async function deletarTarefa(id: string) {
  try {
    return await prisma.tarefa.delete({ where: { id } })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw new AppError('Tarefa não encontrada')
    }
    throw error
  }
}
