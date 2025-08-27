import { describe, it, expect, vi, afterEach } from 'vitest'
import { deleteTask } from '@/backend/services/tarefas/delete-task'

const originalFetch = global.fetch
const originalEnv = process.env.NEXT_PUBLIC_API_URL

afterEach(() => {
  global.fetch = originalFetch
  process.env.NEXT_PUBLIC_API_URL = originalEnv
  vi.clearAllMocks()
})

describe('deleteTask service', () => {
  it('envia requisição DELETE com headers corretos', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = fetchMock as any
    process.env.NEXT_PUBLIC_API_URL = 'http://api'

    await deleteTask('123')

    expect(fetchMock).toHaveBeenCalledWith('http://api/api/tarefas/deletar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: '123' })
    })
  })

  it('lança erro com mensagem da API quando fetch falha', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, json: () => Promise.resolve({ message: 'falha' }) })
    global.fetch = fetchMock as any

    await expect(deleteTask('1')).rejects.toThrow('falha')
  })

  it('lança erro genérico quando fetch falha sem mensagem', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, json: () => Promise.reject(new Error('bad')) })
    global.fetch = fetchMock as any

    await expect(deleteTask('1')).rejects.toThrow('Erro ao excluir tarefa')
  })
})

