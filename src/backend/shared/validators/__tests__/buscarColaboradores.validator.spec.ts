import { describe, it, expect } from 'vitest';
import { buscarColaboradoresSchema } from '@/backend/shared/validators/buscarColaboradores';

describe('buscarColaboradoresSchema', () => {
  it('aceita dados válidos', () => {
    const result = buscarColaboradoresSchema.safeParse({
      page: '3',
      perPage: '20',
      nome: 'Ana',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 3,
      perPage: 20,
      nome: 'Ana',
    });
  });

  it('rejeita perPage maior que 100', () => {
    const result = buscarColaboradoresSchema.safeParse({ perPage: '101' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Too big: expected number to be <=100'
    );
  });

  it('rejeita nome não string', () => {
    const result = buscarColaboradoresSchema.safeParse({ nome: 123 as any });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Invalid input: expected string, received number'
    );
  });
});
