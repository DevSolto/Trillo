import { NextRequest, NextResponse } from 'next/server'
import { criarTarefaUsecase } from '@backend/usecases/tarefas/criarTarefa.usecase'
import { AppError } from '@backend/shared/errors/app-error'

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    const tarefa = await criarTarefaUsecase(data)
    return NextResponse.json(tarefa, { status: 201 })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
