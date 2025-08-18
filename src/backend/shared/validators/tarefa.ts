import { z } from 'zod'

export const tarefaSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  prioridade: z.string(),
  associacaoId: z.string().uuid(),
  criadorId: z.string().uuid(),
  responsavelId: z.string().uuid(),
  statusId: z.string().uuid().nullish(),
  tipoId: z.string().uuid(),
  data_inicio: z.coerce.date(),
  data_fim: z.coerce.date()
})

export type TarefaInput = z.infer<typeof tarefaSchema>
