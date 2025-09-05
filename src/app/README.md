App Router do Next.js: páginas, layouts e rotas.

- `auth/`: telas públicas (login, confirmação, esqueci/reset de senha)
- `(protected)/`: áreas autenticadas (dashboard, associações, tarefas, usuários)
- `layout.tsx`: layout raiz; estilos globais em `globals.css`

Integra com o middleware para redirecionar usuários não autenticados.
