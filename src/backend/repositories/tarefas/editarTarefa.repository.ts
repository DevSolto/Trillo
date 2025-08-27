import { prisma } from '@/prisma/client'
import { EditarTarefaInput } from '@/backend/shared/validators/editarTarefa'
import { AppError } from '@/backend/shared/errors/app-error'

export async function editarTarefa(data: EditarTarefaInput) {
  try {
    let responsavelid: string | undefined
    if (data.responsavelId) {
      const responsavel = await prisma.usuario.findUnique({
        where: { id: data.responsavelId }
      })
      if (!responsavel) {
        throw new AppError('Responsável não encontrado')
      }
      responsavelid = data.responsavelId
    }

    return await prisma.tarefa.update({
      where: { id: data.id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.descricao && { descricao: data.descricao }),
        ...(data.prioridade && { prioridade: data.prioridade }),
        ...(data.associacaoId && { associacaoid: data.associacaoId }),
        ...(data.criadorId && { criadorid: data.criadorId }),
        ...(responsavelid && { responsavelid }),
        ...(data.tipoId && { tipoid: data.tipoId }),
        ...(data.statusId && { statusid: data.statusId }),
        ...(data.data_inicio && { data_inicio: data.data_inicio }),
        ...(data.data_fim && { data_fim: data.data_fim })
      }
    })
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error
    }
    throw error
  }
}
