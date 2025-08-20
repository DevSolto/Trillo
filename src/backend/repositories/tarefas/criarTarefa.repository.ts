
import { TarefaInput } from '@backend/shared/validators/tarefa'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

export async function criarTarefa(data: TarefaInput) {
  try {
    const responsavel = await prisma.usuario.findFirst({
      where: {
          id: data.responsavelId,
      },
    })

    if (!responsavel) {
      throw new AppError('Responsável não encontrado')
    }

    return await prisma.tarefa.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade,
        associacaoid: data.associacaoId,
        criadorid: data.criadorId,
        // utilize o id retornado do banco para evitar inconsistências de FK
        responsavelid: responsavel.id,
        tipoid: data.tipoId,
        statusid: '8eb90bc1-244c-4412-bc9f-3c12097a8d83', // ID do status "Em andamento"
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
      },
    })
  } catch (error: any) {
    if (error instanceof AppError) {
      console.error('Erro de aplicação:', error.message)
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
