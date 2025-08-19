import { z } from 'zod'

export const deletarTarefaSchema = z.object({
  id: z.string().uuid()
})

export type DeletarTarefaInput = z.infer<typeof deletarTarefaSchema>
