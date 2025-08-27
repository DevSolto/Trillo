import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { deletarTarefaUsecase } from '@/backend/usecases/tarefas/deletarTarefa.usecase'
import { deletarTarefaSchema } from '@/backend/shared/validators/deletarTarefa'
import { AppError } from '@/backend/shared/errors/app-error'

const safeJson = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )

export async function DELETE(request: Request) {
  try {
    const body = deletarTarefaSchema.parse(await request.json())
    await deletarTarefaUsecase(body)
    return NextResponse.json(safeJson({ message: 'Tarefa deletada com sucesso' }))
  } catch (error) {
    console.error('DELETE /api/tarefas/deletar', error)
    if (error instanceof ZodError || error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

