# Arquitetura (Frontend)

Este documento descreve como o frontend está organizado na nova versão.

## Stack

- Next.js (App Router) + React
- Tailwind CSS 4, shadcn/ui e Radix UI
- Supabase JS/SSR (autenticação)
- TanStack Table (tabelas), Zod + RHF (formulários)

## Camadas e responsabilidades

- `src/app`: páginas, layouts e rotas; segmentação de áreas públicas e autenticadas
- `src/components`: UI reutilizável e componentes de tela
- `src/hooks`: hooks de UI e integração
- `src/lib`: clientes (Supabase), middleware e utilitários compartilhados

## Rotas e proteção

- Rotas públicas: `/`, `/auth/*`
- Rotas protegidas: agrupadas em `src/app/(protected)`; o middleware redireciona usuários não autenticados para `/auth/login`

## Autenticação (Supabase)

- Cliente browser: `src/lib/client.ts`
- Cliente server (SSR): `src/lib/server.ts`
- Middleware de sessão SSR: `src/lib/middleware.ts` (usado em `middleware.ts`)

## Integração com a API externa

- Proxy via `next.config.ts` converte chamadas a `/api/:path*` em `${NEXT_PUBLIC_API_URL}/:path*`
- A especificação OpenAPI do backend está versionada em `openapi.pretty.json`

## Estilo, Lint e Testes

- ESLint + Prettier (husky/lint-staged em commits)
- Vitest + Testing Library para testes de UI e hooks

## Convenções

- Componentes: pastas coesas por domínio ou tela em `src/components`
- Hooks: `use-*` e testes em `src/hooks/__tests__`
- Variáveis públicas começam com `NEXT_PUBLIC_`

