# 🧾 Sistema de Tarefas para Escritórios Contábeis

Sistema web para escritórios de contabilidade que atendem múltiplas **associações**. Esta versão organiza o frontend em Next.js (App Router) com autenticação via Supabase e consumo de um backend externo via proxy (`/api/*`).

—

## 🚀 Visão Rápida (Quickstart)

- Requisitos: Node.js 20+, PNPM 9+ (recomendado), ou NPM
- Copie `.env.example` para `.env` e preencha as variáveis
- Instale dependências: `pnpm install`
- Ambiente de desenvolvimento: `pnpm dev`
- Build de produção: `pnpm build && pnpm start`
- Testes: `pnpm test` (ou `pnpm test:watch`)

—

## ⚙️ Arquitetura (Nova Organização)

- Frontend: Next.js (App Router) + React, Tailwind CSS 4, shadcn/ui
- Autenticação: Supabase Auth (SDK no frontend)
- API: Backend externo consumido via proxy do Next.js (`rewrites`)
  - Configure `NEXT_PUBLIC_API_URL` no `.env`
  - O arquivo `next.config.ts` reescreve `/api/:path*` para `${NEXT_PUBLIC_API_URL}/:path*`
- Definição da API: OpenAPI disponível em `openapi.pretty.json`

—

## 🔧 Variáveis de Ambiente

- `NEXT_PUBLIC_SITE_URL`: URL pública do site (ex.: `http://localhost:3000`)
- `NEXT_PUBLIC_API_URL`: base URL da API externa (ex.: `https://trillo-back-end.onrender.com`)
- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`: credenciais públicas do projeto Supabase

Copie `./.env.example` para `./.env` e ajuste os valores conforme seu ambiente.

—

## 📁 Estrutura de Diretórios

```
src/
├── app/            # Páginas, layouts e rotas (App Router)
│   ├── auth/       # Fluxos de autenticação (login, reset, confirm)
│   └── (protected)/# Áreas autenticadas (dashboard, tarefas, associações, usuários)
├── components/     # Componentes reutilizáveis (UI e específicos de tela)
├── hooks/          # Hooks (ex.: responsividade, dados, utilitários)
└── lib/            # Clientes (Supabase), middleware e utilitários

root
├── next.config.ts  # Rewrites para a API externa
├── middleware.ts   # Atualização de sessão (Supabase SSR)
├── openapi*.json   # Especificação OpenAPI consumida pelo frontend
└── vitest.config.ts# Configuração de testes
```

—

## 🔐 Autenticação e Middleware

- O middleware em `middleware.ts` delega para `src/lib/middleware.ts` e mantém a sessão sincronizada (SSR) com o Supabase.
- Rotas em `(protected)` exigem usuário autenticado; não autenticados são redirecionados para `/auth/login`.

—

## 📄 Páginas e Navegação

- Login, confirmação, redefinição de senha (`/auth/*`)
- Dashboard com KPIs (`/(protected)/dashboard`)
- Associações: listagem e detalhes
- Tarefas: listagem com filtros, criação/edição e detalhes
- Usuários: listagem (apenas áreas autorizadas)

—

## 🧰 Tecnologias

- Next.js (App Router) + React
- Tailwind CSS 4 + shadcn/ui + Radix UI
- Supabase JS/SSR (autenticação)
- TanStack Table (tabelas)
- Zod, React Hook Form (validação e formulários)

—

## 🧪 Testes, Lint e Formatação

- Testes: Vitest + Testing Library
  - `pnpm test` executa os testes em modo headless
  - `pnpm test:watch` para desenvolvimento
- Lint: `pnpm lint` (ESLint)
- Format: `pnpm format` (Prettier)
- Husky + lint-staged: executa checks em commits

—

## 🔗 API e Integração

- O frontend consome a API externa via proxy: requisições a `/api/*` são encaminhadas para `${NEXT_PUBLIC_API_URL}`
- A especificação OpenAPI vive em `openapi.pretty.json` (legível) e `openapi.json`
- Detalhes estão em `docs/API.md` (como atualizar, endpoints chave e convenções)

—

## 🧠 Modelo de Domínio (resumo)

- Usuário: gerido via Supabase Auth; metadados podem existir em perfil próprio no backend
- Associação: cliente contábil (identificação, CNPJ, localização, etc.)
- Tarefa: pertence a uma associação e a um responsável; contém status, tipo, prazos
- Status: definido dinamicamente pelo escritório
- Tipo de Tarefa: catálogo dinâmico (ex.: “Folha Mensal”, “DIRF Anual”)

—

## 📌 Roadmap (próximas melhorias)

- Sub-etapas por tarefa, comentários e anexos
- Histórico de alterações e tarefas recorrentes
- Modo Kanban e integração com calendário

—

## 📚 Leituras complementares

- Arquitetura detalhada: `docs/ARCHITECTURE.md`
- API e uso de OpenAPI: `docs/API.md`
- Contribuição e fluxo de desenvolvimento: `CONTRIBUTING.md`
