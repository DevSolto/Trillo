import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { editarTarefaUsecase } from '@/backend/usecases/tarefas/editarTarefa.usecase'
import { editarTarefaSchema } from '@/backend/shared/validators/editarTarefa'
import { AppError } from '@/backend/shared/errors/app-error'

const safeJson = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )

export async function PUT(request: Request) {
  try {
    const body = editarTarefaSchema.parse(await request.json())
    const tarefa = await editarTarefaUsecase(body)
    return NextResponse.json(safeJson(tarefa))
  } catch (error) {
    console.error('PUT /api/tarefas/editar', error)
    if (error instanceof ZodError || error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

