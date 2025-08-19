import { z } from 'zod'
import { tarefaSchema } from './tarefa'

export const editarTarefaSchema = tarefaSchema.partial().extend({
  id: z.string().uuid()
})

export type EditarTarefaInput = z.infer<typeof editarTarefaSchema>
