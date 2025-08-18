import { z } from 'zod'

export const buscarAssociacoesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  nome: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional()
})

export type BuscarAssociacoesInput = z.infer<typeof buscarAssociacoesSchema>
