
import { TarefaInput } from '@backend/shared/validators/tarefa'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

export async function criarTarefa(data: TarefaInput) {
  try {
    const [criador, responsavel] = await Promise.all([
      prisma.usuario.findUnique({ where: { user_id: data.criadorId } }),
      prisma.usuario.findFirst({
        where: { OR: [{ id: data.responsavelId }, { user_id: data.responsavelId }] }
      })
    ])

    if (!criador) {
      throw new AppError('Criador não encontrado')
    }

    if (!responsavel) {
      throw new AppError('Responsável não encontrado')
    }

    return await prisma.tarefa.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade,
        associacaoid: data.associacaoId,
        criadorid: criador.id,
        responsavelid: responsavel.id,
        ...(data.statusId ? { statusid: data.statusId } : {}),
        tipoid: data.tipoId,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
      },
    })
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error
    }
    if (
      error?.code === 'P2003' &&
      (error?.meta?.field_name || error?.meta?.target)?.toLowerCase?.().includes('responsavelid')
    ) {
      throw new AppError('Responsável não encontrado')
    }

    throw error
  }
}
