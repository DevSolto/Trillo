import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { buscarAssociacoesUsecase } from '@backend/usecases/associacoes/buscarAssociacoes.usecase'
import { buscarAssociacoesSchema } from '@backend/shared/validators/buscarAssociacoes'
import { AppError } from '@backend/shared/errors/app-error'

const safeJson = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const params = buscarAssociacoesSchema.parse(
      Object.fromEntries(url.searchParams.entries())
    )
    const result = await buscarAssociacoesUsecase(params)
    return NextResponse.json(safeJson(result))
  } catch (error) {
    console.error('GET /api/associacoes/buscar', error)
    if (error instanceof ZodError || error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

