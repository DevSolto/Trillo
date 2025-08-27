import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { criarTarefaUsecase } from '@backend/usecases/tarefas/criarTarefa.usecase'
import { tarefaSchema } from '@backend/shared/validators/tarefa'
import { AppError } from '@backend/shared/errors/app-error'

const safeJson = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )

export async function POST(request: Request) {
  try {
    const body = tarefaSchema.parse(await request.json())
    const tarefa = await criarTarefaUsecase(body)
    return NextResponse.json(safeJson(tarefa), { status: 201 })
  } catch (error) {
    console.error('POST /api/tarefas/criar', error)
    if (error instanceof ZodError || error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

