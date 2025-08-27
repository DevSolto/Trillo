import { describe, it, expect } from 'vitest';
import { buscarTiposSchema } from '@/backend/shared/validators/buscarTipos';

describe('buscarTiposSchema', () => {
  it('aceita dados válidos', () => {
    const result = buscarTiposSchema.safeParse({
      page: '2',
      perPage: '10',
      nome: 'abc',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 2,
      perPage: 10,
      nome: 'abc',
    });
  });

  it('rejeita perPage maior que 100', () => {
    const result = buscarTiposSchema.safeParse({ perPage: '101' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Too big: expected number to be <=100'
    );
  });
});
