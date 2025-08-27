import { describe, it, expect } from 'vitest';
import { buscarAssociacoesSchema } from '@/backend/shared/validators/buscarAssociacoes';

describe('buscarAssociacoesSchema', () => {
  it('valida dados válidos', () => {
    const result = buscarAssociacoesSchema.safeParse({
      page: '2',
      perPage: '5',
      nome: 'abc',
      cidade: 'xyz',
      estado: 'SP',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 2,
      perPage: 5,
      nome: 'abc',
      cidade: 'xyz',
      estado: 'SP',
    });
  });

  it('rejeita perPage maior que 100', () => {
    const result = buscarAssociacoesSchema.safeParse({ perPage: '101' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Too big: expected number to be <=100'
    );
  });
});
