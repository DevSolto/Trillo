export interface Tarefa {
  id: string
  titulo: string
  descricao: string
  prioridade: string
  associacaoId: string
  criadorId: string
  responsavelId: string
  statusId: string
  tipoId: string
  data_inicio: Date
  data_fim: Date
}
