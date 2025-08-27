import { buscarTipos } from '@/backend/repositories/tipos/buscarTipos.repository'
import { BuscarTiposInput, buscarTiposSchema } from '@/backend/shared/validators/buscarTipos'

export async function buscarTiposUsecase(input: BuscarTiposInput) {
  const data = buscarTiposSchema.parse(input)
  return buscarTipos(data)
}
