import { NextRequest, NextResponse } from 'next/server'
import { deletarTarefaUsecase } from '@backend/usecases/tarefas/deletarTarefa.usecase'
import { AppError } from '@backend/shared/errors/app-error'

export async function DELETE(request: NextRequest) {
  const data = await request.json()
  try {
    await deletarTarefaUsecase(data)
    return NextResponse.json({ message: 'Tarefa deletada com sucesso' }, { status: 200 })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.log(error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
