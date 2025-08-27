# Diretrizes e Boas Práticas de Desenvolvimento (Next.js + TypeScript Monolito)

## 1. Boas Práticas de Codificação (TypeScript e Next.js)

-   **Estrutura de Projeto:** Siga as convenções do Next.js para
    organizar pastas e arquivos. Mantenha o front-end (páginas,
    componentes) e back-end (rotas API) bem estruturados -- por exemplo,
    usando diretórios separados por funcionalidade ou módulo (ex:
    `pages/`, `components/`, `services/`, `utils/`). No Next 13+,
    aproveite o diretório `app/` com subpastas para rotas aninhadas e
    arquivos especiais (`layout.tsx`, `page.tsx`, `route.ts` etc.)
    conforme recomendação da documentação. Isso garante uma base de
    código organizada e modular, facilitando a manutenção.\
-   **Tipagem Forte:** Utilize ao máximo o sistema de tipos do
    TypeScript. Habilite o modo estrito no `tsconfig.json` e declare
    explicitamente os tipos de parâmetros, retornos de funções e
    variáveis importantes para evitar ambiguidade. **Evite** usar o tipo
    `any` -- ele anula os benefícios da tipagem estática e pode mascarar
    erros graves. Quando for tentador usar `any`, prefira uma tipagem
    mais específica ou o tipo `unknown`, que é mais seguro (exige
    verificação de tipo antes do uso).\
-   **Interfaces e Types:** Prefira definir **interfaces** para
    descrever a forma de objetos em vez de type aliases de literais de
    objeto. Interfaces são mais expansíveis e claras, além de serem
    recomendadas pelo guia do TypeScript do Google para modelos de
    objeto. Use **type aliases** para outros propósitos (uniões, tuplas,
    tipos primitivos compostos), mas para objetos complexos mantenha o
    padrão de interfaces -- isso melhora a consistência e legibilidade
    do código.\
-   **Componentização e Separação de Responsabilidades:** Em projetos
    Next.js monolíticos, isole responsabilidades em componentes e
    módulos. Crie componentes React pequenos e reutilizáveis (funções
    curtas e focadas são mais fáceis de testar e manter). Mantenha
    lógica de negócio separada da apresentação -- por exemplo, coloque
    funcionalidades de dados/negócio em arquivos de serviço ou
    utilitários, enquanto os componentes focam apenas em
    renderização/UI. Esse princípio de separação limpa (separation of
    concerns) torna o código mais **manutenível** e facilita
    escalabilidade conforme o projeto cresce.\
-   **Imports e Módulos:** Organize as dependências de modo claro.
    Utilize caminhos de importação absolutos ou aliases configurados no
    `tsconfig` (ex: `@/components/MeuComponente`) para evitar imports
    relativos longos. O TypeScript/Next suporta path aliases, tornando o
    código mais legível. Além disso, evite dependências cíclicas e
    organize os módulos de forma hierárquica (por feature ou camada)
    para reduzir o acoplamento.

## 2. Convenções de Estilo e Padronização de Código

-   **Guia de Estilo Consistente:** Adote um guia de estilo reconhecido
    para TypeScript. Grandes empresas como o Google seguem padrões
    rigorosos -- por exemplo, o **Google TypeScript Style Guide**
    padroniza desde formatação até nomenclatura. Ferramentas como o
    `gts` (Google TS Style) combinam linter e formatter para aplicar
    essas regras automaticamente. O importante é definir convenções
    claras (uso de camelCase para variáveis e funções, PascalCase para
    componentes React, etc.) e segui-las uniformemente em todo o
    repositório.\
-   **Linting e Formatação Automática:** Configure linters (ESLint) e
    formatadores (Prettier) integrados ao projeto para garantir estilo
    consistente e evitar "bike-shedding" em reviews. Por exemplo, a
    configuração padrão do Google TS já inclui ESLint + Prettier para
    aplicar indentação, aspas, ponto-e-vírgula, etc., de forma
    consistente. Utilize hooks de commit ou pipelines CI para rodar o
    lint/format -- assim, todo commit já segue o padrão definido. Isso
    aumenta a qualidade e legibilidade do código, além de poupar tempo
    de revisão em detalhes de formato.\
-   **Nomenclatura e Legibilidade:** Siga convenções de nomenclatura
    legíveis. Escolha nomes de variáveis e funções descritivos (evitando
    abreviações obscuras). Mantenha a consistência: por exemplo, use
    substantivos para nomes de classes/objetos, verbos para funções que
    executam ações, e CONSTANTES em maiúsculas se aplicável. Nomes de
    arquivos podem usar **kebab-case** ou **camelCase** de acordo com o
    padrão do time, mas de forma unificada. Arquivos que exportam um
    único componente React geralmente usam PascalCase no nome do arquivo
    correspondente ao componente (ex: `MeuFormulario.tsx` contendo
    `function MeuFormulario()`). Uma convenção consistente facilita a
    busca de arquivos e reduz a curva de aprendizado para novos
    contribuidores.\
-   **Código Autoexplicativo e Comentários Necessários:** Esforce-se
    para escrever código claro que *"se explica"* -- ou seja, que a
    função e intenção sejam evidentes pela nomeação e estrutura.
    Contudo, complemente com **comentários** onde for útil para contexto
    adicional. Use comentários de implementação (`// …`) para explicar
    partes complexas ou hacks necessários, e comentários de documentação
    JSDoc (`/** … */`) para descrever o uso de funções, parâmetros e
    retornos não óbvios. Grandes empresas padronizam isso: comentários
    JSDoc devem agregar informação (não apenas repetir o nome da função)
    e esclarecer o "porquê" do código, ajudando outros desenvolvedores a
    entender rapidamente o propósito de cada componente.

... (conteúdo continua com todas as seções até o final) ...
