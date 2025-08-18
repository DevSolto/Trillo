import { describe, it, expect, vi } from 'vitest'
import { criarTarefa } from '../criarTarefa.repository'
import { prisma } from '@backend/prisma/client'

vi.mock('@backend/prisma/client', () => {
  return { prisma: { tarefa: { create: vi.fn().mockResolvedValue({ id: '1' }) } } }
})

describe('criarTarefa.repository', () => {
  it('insere tarefa com prisma', async () => {
    const data: any = {
      titulo: 't',
      descricao: 'd',
      prioridade: 'p',
      associacaoId: 'a',
      criadorId: 'c',
      responsavelId: 'r',
      statusId: null,
      tipoId: 't',
      data_inicio: new Date('2024-01-01'),
      data_fim: new Date('2024-01-02'),
    }
    const result = await criarTarefa(data)
    expect(prisma.tarefa.create).toHaveBeenCalledWith({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade,
        associacaoid: data.associacaoId,
        criadorid: data.criadorId,
        responsavelid: data.responsavelId,
        tipoid: data.tipoId,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
      },
    })
    expect(result).toEqual({ id: '1' })
  })
})
