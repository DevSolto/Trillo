import { describe, it, expect, vi, afterEach } from 'vitest'
import { updateTask, type UpdateTaskInput } from '@/backend/services/tarefas/update-task'

const mockGetUser = vi.fn()

vi.mock('@/lib/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser }
  })
}))

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
  vi.clearAllMocks()
})

describe('updateTask service', () => {
  const baseInput: UpdateTaskInput = {
    id: '1',
    titulo: 't',
    descricao: 'd',
    prioridade: 'alta',
    responsavelId: 'r1',
    associacaoId: 'a1',
    tipoId: 'tp1'
  }

  it('envia requisição PUT com headers e corpo corretos', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = fetchMock as any
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user1' } } })

    await updateTask(baseInput)

    expect(fetchMock).toHaveBeenCalledWith('/api/tarefas/editar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...baseInput, criadorId: 'user1' })
    })
  })

  it('lança erro com mensagem da API quando fetch falha', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, json: () => Promise.resolve({ message: 'erro api' }) })
    global.fetch = fetchMock as any
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user1' } } })

    await expect(updateTask(baseInput)).rejects.toThrow('erro api')
  })

  it('lança erro quando usuário não autenticado', async () => {
    const fetchMock = vi.fn()
    global.fetch = fetchMock as any
    mockGetUser.mockResolvedValue({ data: { user: null } })

    await expect(updateTask(baseInput)).rejects.toThrow('Usuário não autenticado')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

