import { buscarColaboradores } from '@/backend/repositories/colaboradores/buscarColaboradores.repository'
import { BuscarColaboradoresInput, buscarColaboradoresSchema } from '@/backend/shared/validators/buscarColaboradores'

export async function buscarColaboradoresUsecase(input: BuscarColaboradoresInput) {
  const data = buscarColaboradoresSchema.parse(input)
  return buscarColaboradores(data)
}
