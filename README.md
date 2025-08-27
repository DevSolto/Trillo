# 🧾 Sistema de Tarefas para Escritórios Contábeis de Associações (MVP)

Sistema web voltado para escritórios de contabilidade que atendem múltiplas **associações**. Este MVP foca em um escopo mais simples: gerenciamento de tarefas vinculadas diretamente a uma associação e atribuídas a um único responsável.

---

## ⚙️ Arquitetura

- **Frontend:** React / Next.js
- **Backend:** Monolito em TypeScript com 3 camadas:
  - `controllers` → rotas e validação
  - `usecases` → lógica de negócio pura
  - `repositories` → persistência via Prisma ORM
- **Banco de Dados:** PostgreSQL (via Supabase)
  - **Autenticação:** Supabase Auth com vínculo entre `user.id` e `PerfilUsuario`

---

## 📁 Estrutura de Diretórios

```
src/
├── app/                 # Frontend com rotas e páginas
└── backend/
    ├── prisma/          # Cliente Prisma
    ├── usecases/        # Casos de uso por domínio
    ├── repositories/    # Repositórios por domínio
    ├── entities/        # Tipos e validações
    └── shared/          # Erros e validadores
```

---

## 🧩 Entidades principais

### `Usuario`

- Integrado ao Supabase Auth
- Campos: `id`, `email`, `nome`, `tipo` (`admin` ou `operador`)
- Tabela `PerfilUsuario` vinculada ao `auth.users` do Supabase

### `Associacao`

- Representa o cliente contábil
- Campos: `id`, `nome`, `CNPJ`, `cidade`, `estado`, `data_criacao`, etc.

### `Tarefa`

- Relacionada a uma associação
- Atribuída diretamente a um usuário responsável
- Campos: `id`, `nome`, `descricao`, `prazo`, `status`, `id_associacao`, `tipo_id`, `responsavel_id`, `data_criacao`, `data_conclusao`

### `Status`

- Definido dinamicamente pelo admin
- Permite etapas customizadas no fluxo
- Exemplo: "Pendente", "Revisão", "Finalizado"

### `TipoTarefa`

- Criado dinamicamente pelo usuário
- Exemplo: “Folha Mensal”, “Apuração Simples Nacional”, “DIRF Anual”

---

## 📄 Funcionalidades

### Para Admins e Operadores

- Gerenciar **usuários** e **associações**
- Criar e editar **tarefas**
- Atribuir **usuário responsável por tarefa**
- Criar e editar **status** e **tipos de tarefa**
- Visualizar **dashboard operacional** com métricas como:
  - Total de tarefas por associação
  - Tempo médio por tarefa
  - Tarefas em andamento, concluídas e atrasadas
  - Associação mais frequente
- Listar tarefas com **filtros por cidade, estado, tipo e status**
- Visualizar **detalhes de cada tarefa**

---

## 🧠 Regras de negócio

- Cada tarefa é atribuída a **um único usuário responsável**
- Os **status** são definidos pelo próprio escritório (dinâmicos)
- Uma associação pode ter múltiplas tarefas simultâneas

---

## 📊 Páginas e navegação

- **Login** (Supabase Auth)
- **Dashboard** com KPIs
- **Listagem de Associações** com filtros e paginação
- **Detalhe da Associação**
  - Lista de tarefas relacionadas
- **Listagem de Tarefas**
  - Filtros por cidade, estado, status e tipo
- **Detalhe da Tarefa**
  - Edição da tarefa
- **Formulário de criação/edição de tarefa**
- **Gestão de Tipos de Tarefa**
- **Gestão de Status**

---

## 🧰 Tecnologias

| Camada       | Tecnologia                |
| ------------ | ------------------------- |
| Autenticação | Supabase Auth             |
| ORM          | Prisma                    |
| Banco        | PostgreSQL                |
| Backend      | TypeScript Monolito       |
| Frontend     | Next.js                   |
| UI           | TailwindCSS com shadcn.ui |

---

## 🚀 Melhorias futuras

- Inclusão de múltiplos passos por tarefa
- Comentários e anexos
- Histórico de alterações
- Tarefas recorrentes
- Modo Kanban
- Integração com calendário
