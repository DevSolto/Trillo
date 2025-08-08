import { z } from 'zod'

export const buscarTarefasSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  titulo: z.string().optional(),
  statusId: z.string().uuid().optional(),
  prioridade: z.string().optional()
})

export type BuscarTarefasInput = z.infer<typeof buscarTarefasSchema>
