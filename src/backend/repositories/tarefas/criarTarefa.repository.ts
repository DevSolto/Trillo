
import { TarefaInput } from '@backend/shared/validators/tarefa'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

export async function criarTarefa(data: TarefaInput) {
  try {
    return await prisma.tarefa.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade,
        associacaoid: data.associacaoId,
        criadorid: data.criadorId,
        responsavelid: data.responsavelId,
        ...(data.statusId ? { statusid: data.statusId } : {}),
        tipoid: data.tipoId,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
      },
    })
  } catch (error: any) {
    if (error?.code === 'P2003' && error?.meta?.field_name?.includes('responsavelid')) {
      throw new AppError('Responsável não encontrado')
    }
    throw error
  }
}
