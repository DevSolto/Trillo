
import { TarefaInput } from '@backend/shared/validators/tarefa'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

export async function criarTarefa(data: TarefaInput) {
  try {
    const [criador, responsavel] = await Promise.all([
      prisma.usuario.findUnique({ where: { id: data.criadorId } }),
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
    const fieldName = (error?.meta?.field_name || error?.meta?.target || '').toLowerCase()

    if (error?.code === 'P2003') {
      if (fieldName.includes('responsavelid')) {
        throw new AppError('Responsável não encontrado')
      }

      if (fieldName.includes('criadorid')) {
        throw new AppError('Criador não encontrado')
      }
    }

    throw error
  }
}
