import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { buscarTiposUsecase } from '@/backend/usecases/tipos/buscarTipos.usecase'
import { buscarTiposSchema } from '@/backend/shared/validators/buscarTipos'
import { AppError } from '@/backend/shared/errors/app-error'

const safeJson = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const params = buscarTiposSchema.parse(
      Object.fromEntries(url.searchParams.entries())
    )
    const result = await buscarTiposUsecase(params)
    return NextResponse.json(safeJson(result))
  } catch (error) {
    console.error('GET /api/tipos/buscar', error)
    if (error instanceof ZodError || error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

