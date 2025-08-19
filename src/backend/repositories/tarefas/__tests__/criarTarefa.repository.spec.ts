import { describe, it, expect, vi } from 'vitest'
import { criarTarefa } from '../criarTarefa.repository'
import { prisma } from '@backend/prisma/client'
import { AppError } from '@backend/shared/errors/app-error'

vi.mock('@backend/prisma/client', () => {
  return { prisma: { tarefa: { create: vi.fn() } } }
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
    vi.mocked(prisma.tarefa.create).mockResolvedValue({ id: '1' } as any)
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

  it('lança AppError quando responsavel não existe', async () => {
    const prismaError = { code: 'P2003', meta: { field_name: 'tarefa_responsavelid_fkey' } }
    vi.mocked(prisma.tarefa.create).mockRejectedValue(prismaError as any)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })

  it('lança AppError quando responsavel não existe (meta.target)', async () => {
    const prismaError = { code: 'P2003', meta: { target: 'tarefa_responsavelid_fkey' } }
    vi.mocked(prisma.tarefa.create).mockRejectedValue(prismaError as any)
    await expect(criarTarefa(data)).rejects.toBeInstanceOf(AppError)
  })
})
