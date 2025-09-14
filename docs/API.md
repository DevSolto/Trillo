# API e Integração

O frontend consome um backend externo através de proxy do Next.js.

## Base URL e Proxy

- Defina `NEXT_PUBLIC_API_URL` no `.env` (ex.: `https://trillo-back-end.onrender.com`)
- Chamadas no frontend devem usar caminhos relativos iniciando por `/api/...`
- O Next.js reescreve para `${NEXT_PUBLIC_API_URL}/...` (ver `next.config.ts`)

## Documentação da API

- A documentação oficial da API é mantida no repositório/ambiente do backend.
- Este repositório não versiona OpenAPI. Consulte o backend para contratos, modelos e parâmetros de endpoints (ex.: `/user`, `/association`, `/task`).

## Autenticação nas requisições

- Para endpoints protegidos, o backend pode requerer bearer token/sessão; siga a documentação do backend.
- O frontend usa Supabase Auth para gerenciar sessão do usuário; inclua cabeçalhos/credenciais conforme o backend exige.
