import { describe, it, expect, vi } from 'vitest'
import { criarTarefa } from '../criarTarefa.repository'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

vi.mock('@backend/prisma/client', () => {
  return {
    prisma: {
      tarefa: { create: vi.fn() },
      usuario: { findUnique: vi.fn(), findFirst: vi.fn() }
    }
  }
})

describe('criarTarefa.repository', () => {
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

  it('insere tarefa com prisma', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: 'creator' } as any)
    vi.mocked(prisma.usuario.findFirst).mockResolvedValue({ id: 'responsavel' } as any)
    vi.mocked(prisma.tarefa.create).mockResolvedValue({ id: '1' } as any)
    const result = await criarTarefa(data)
    expect(prisma.tarefa.create).toHaveBeenCalledWith({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade,
        associacaoid: data.associacaoId,
        criadorid: 'creator',
        responsavelid: 'responsavel',
        tipoid: data.tipoId,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
      },
    })
    expect(result).toEqual({ id: '1' })
  })

  it('lança AppError quando responsavel não existe', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: 'creator' } as any)
    vi.mocked(prisma.usuario.findFirst).mockResolvedValue(null)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })

  it('lança AppError quando criador não existe', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(null)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })

  it('lança AppError quando prisma retorna P2003 de responsavelid', async () => {
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: 'creator' } as any)
    vi.mocked(prisma.usuario.findFirst).mockResolvedValue({ id: 'responsavel' } as any)
    const prismaError = { code: 'P2003', meta: { field_name: 'tarefa_responsavelid_fkey' } }
    vi.mocked(prisma.tarefa.create).mockRejectedValue(prismaError as any)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })
})
