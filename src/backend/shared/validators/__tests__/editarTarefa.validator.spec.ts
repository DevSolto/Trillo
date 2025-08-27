import { describe, it, expect } from 'vitest';
import { editarTarefaSchema } from '@/backend/shared/validators/editarTarefa';

const uuid = '4e6e1b70-a267-4810-9e78-5dd4034e4466';

describe('editarTarefaSchema', () => {
  it('aceita dados válidos', () => {
    const result = editarTarefaSchema.safeParse({ id: uuid, titulo: 'abc' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: uuid, titulo: 'abc' });
  });

  it('rejeita id ausente', () => {
    const result = editarTarefaSchema.safeParse({} as any);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Invalid input: expected string, received undefined'
    );
  });

  it('rejeita id inválido', () => {
    const result = editarTarefaSchema.safeParse({ id: 'invalid' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Invalid UUID');
  });
});
