# API e Integração

O frontend consome um backend externo através de proxy do Next.js.

## Base URL e Proxy

- Defina `NEXT_PUBLIC_API_URL` no `.env` (ex.: `https://trillo-back-end.onrender.com`)
- Chamadas no frontend devem usar caminhos relativos iniciando por `/api/...`
- O Next.js reescreve para `${NEXT_PUBLIC_API_URL}/...` (ver `next.config.ts`)

## OpenAPI

- Especificação legível: `openapi.pretty.json`
- Especificação compacta: `openapi.json`

Use esses arquivos como referência de contratos, modelos e parâmetros de endpoints (ex.: `/user`, `/associacao`, `/tarefa`).

## Autenticação nas requisições

- Para endpoints protegidos, o backend pode requerer bearer token ou sessão; veja as seções `security` da OpenAPI
- O frontend usa Supabase Auth para gerenciar sessão do usuário; inclua cabeçalhos/credenciais conforme o backend exige

## Atualizando a especificação

- Ao publicar mudanças no backend, exporte a nova OpenAPI e substitua os arquivos `openapi*.json`
- Mantenha a documentação e os tipos deriváveis (se houver) sincronizados

