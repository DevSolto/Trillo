import { describe, it, expect, vi } from 'vitest'
import { criarTarefa } from '../criarTarefa.repository'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'
import { TarefaInput } from '@backend/shared/validators/tarefa'

vi.mock('@backend/prisma/client', () => {
  return {
    prisma: {
      tarefa: { create: vi.fn() },
      usuario: { findUnique: vi.fn() }
    }
  }
})

describe('criarTarefa.repository', () => {
  const data: TarefaInput = {
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

  it('insere tarefa com prisma', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: 'responsavel' } as unknown)
    vi.mocked(prisma.tarefa.create).mockResolvedValue({ id: '1' } as unknown)
    const result = await criarTarefa(data)
    expect(prisma.tarefa.create).toHaveBeenCalledWith({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade,
        associacaoid: data.associacaoId,
        criadorid: data.criadorId,
        // o id salvo deve ser o retornado do banco
        responsavelid: 'responsavel',
        tipoid: data.tipoId,
        statusid: '8eb90bc1-244c-4412-bc9f-3c12097a8d83',
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
      },
    })
    expect(result).toEqual({ id: '1' })
  })

  it('lança AppError quando responsavel não existe', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(null)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })

  it('lança AppError quando prisma retorna P2003 de responsavelid', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: 'responsavel' } as unknown)
    const prismaError = { code: 'P2003', meta: { field_name: 'tarefa_responsavelid_fkey' } }
    vi.mocked(prisma.tarefa.create).mockRejectedValue(prismaError as unknown)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })

  it('lança AppError quando prisma retorna P2003 de criadorid', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: 'responsavel' } as unknown)
    const prismaError = { code: 'P2003', meta: { field_name: 'tarefa_criadorid_fkey' } }
    vi.mocked(prisma.tarefa.create).mockRejectedValue(prismaError as unknown)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })
})
