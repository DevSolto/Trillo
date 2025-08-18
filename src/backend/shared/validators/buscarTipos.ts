import { z } from 'zod'

export const buscarTiposSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  nome: z.string().optional()
})

export type BuscarTiposInput = z.infer<typeof buscarTiposSchema>
