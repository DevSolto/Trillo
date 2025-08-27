import { describe, it, expect } from 'vitest';
import { buscarTarefasSchema } from '@/backend/shared/validators/buscarTarefas';

const uuid = '4e6e1b70-a267-4810-9e78-5dd4034e4466';

describe('buscarTarefasSchema', () => {
  it('aceita dados válidos', () => {
    const result = buscarTarefasSchema.safeParse({
      page: '2',
      perPage: '5',
      titulo: 'abc',
      statusId: uuid,
      prioridade: 'alta',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 2,
      perPage: 5,
      titulo: 'abc',
      statusId: uuid,
      prioridade: 'alta',
    });
  });

  it('rejeita perPage maior que 100', () => {
    const result = buscarTarefasSchema.safeParse({ perPage: '101' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Too big: expected number to be <=100'
    );
  });

  it('rejeita statusId inválido', () => {
    const result = buscarTarefasSchema.safeParse({ statusId: 'invalid-uuid' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Invalid UUID');
  });
});
