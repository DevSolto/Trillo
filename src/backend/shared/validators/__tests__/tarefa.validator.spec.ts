import { describe, it, expect } from 'vitest';
import { tarefaSchema } from '@/backend/shared/validators/tarefa';

const uuid = '4e6e1b70-a267-4810-9e78-5dd4034e4466';
const makeValid = () => ({
  titulo: 't',
  descricao: 'd',
  prioridade: 'alta',
  associacaoId: uuid,
  criadorId: uuid,
  responsavelId: uuid,
  statusId: uuid,
  tipoId: uuid,
  data_inicio: '2024-01-01',
  data_fim: '2024-01-02',
});

describe('tarefaSchema', () => {
  it('aceita dados válidos', () => {
    const input = makeValid();
    const result = tarefaSchema.safeParse(input);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      ...input,
      data_inicio: new Date('2024-01-01'),
      data_fim: new Date('2024-01-02'),
    });
  });

  it('rejeita titulo ausente', () => {
    const { titulo, ...rest } = makeValid();
    const result = tarefaSchema.safeParse(rest as any);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Invalid input: expected string, received undefined'
    );
  });

  it('rejeita associacaoId inválido', () => {
    const input = { ...makeValid(), associacaoId: 'invalid' };
    const result = tarefaSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Invalid UUID');
  });
});
