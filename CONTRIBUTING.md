# Contribuindo

Obrigado por contribuir! Este guia resume o fluxo de desenvolvimento.

## Requisitos

- Node.js 20+
- PNPM 9+ (ou NPM/Yarn)

## Setup

1) Copie `.env.example` para `.env` e preencha as variáveis
2) Instale dependências: `pnpm install`
3) Rode o ambiente: `pnpm dev`

## Scripts úteis

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm test` / `pnpm test:watch`
- `pnpm lint` / `pnpm format`

## Qualidade de código

- ESLint + Prettier com husky/lint-staged nos commits
- Mantenha componentes coesos e pequenos; prefira composição
- Validação com Zod e formulários com React Hook Form

## Git e PRs

- Crie branches descritivas (ex.: `feat/tarefas-filtros`, `fix/auth-redirect`)
- Abra PRs pequenos, com descrição do contexto e screenshots quando útil
- Checklist: build passa, testes relevantes, lint/format ok, docs atualizadas

