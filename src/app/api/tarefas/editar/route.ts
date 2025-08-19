import { NextRequest, NextResponse } from 'next/server'
import { editarTarefaUsecase } from '@backend/usecases/tarefas/editarTarefa.usecase'
import { AppError } from '@backend/shared/errors/app-error'

export async function PUT(request: NextRequest) {
  const data = await request.json()
  try {
    const tarefa = await editarTarefaUsecase(data)
    return NextResponse.json(tarefa, { status: 200 })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.log(error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
