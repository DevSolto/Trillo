import { NextRequest, NextResponse } from 'next/server'
import { criarTarefaUsecase } from '@backend/usecases/tarefas/criarTarefa.usecase'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const tarefa = await criarTarefaUsecase(data)
  return NextResponse.json(tarefa, { status: 201 })
}
