import { describe, it, expect } from 'vitest';
import { deletarTarefaSchema } from '@/backend/shared/validators/deletarTarefa';

const uuid = '4e6e1b70-a267-4810-9e78-5dd4034e4466';

describe('deletarTarefaSchema', () => {
  it('aceita id válido', () => {
    const result = deletarTarefaSchema.safeParse({ id: uuid });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: uuid });
  });

  it('rejeita id ausente', () => {
    const result = deletarTarefaSchema.safeParse({} as any);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Invalid input: expected string, received undefined'
    );
  });

  it('rejeita id inválido', () => {
    const result = deletarTarefaSchema.safeParse({ id: 'invalid' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Invalid UUID');
  });
});
