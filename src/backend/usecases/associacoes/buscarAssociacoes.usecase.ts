import { buscarAssociacoes } from '@backend/repositories/associacoes/buscarAssociacoes.repository'
import { BuscarAssociacoesInput, buscarAssociacoesSchema } from '@backend/shared/validators/buscarAssociacoes'

export async function buscarAssociacoesUsecase(input: BuscarAssociacoesInput) {
  const data = buscarAssociacoesSchema.parse(input)
  return buscarAssociacoes(data)
}
