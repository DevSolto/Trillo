import { buscarTarefasUsecase } from '@backend/usecases/tarefas/buscarTarefas.usecase'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const params = Object.fromEntries(url.searchParams.entries())
  const result = await buscarTarefasUsecase(params as any)
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
