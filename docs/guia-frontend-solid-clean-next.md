# Documentação de Boas Práticas – Projeto SaaS de Gerenciamento de Tarefas (Contabilidade)
##Princípios SOLID Aplicados ao Frontend (React/Next.js)

1. Single Responsibility Principle (Responsabilidade Única): Cada componente, função ou módulo deve ter uma única responsabilidade bem definida e um motivo único para mudar
dev.to
	. Evite misturar múltiplas lógicas em um só componente – por exemplo, um componente de página não deve ele mesmo buscar dados do servidor ou gerenciar estado global não relacionado. Em vez disso, delegue essas tarefas a hooks personalizados ou serviços especializados, mantendo o componente focado apenas em renderizar a UI com os dados fornecidos
dev.to
	. Essa separação torna o código mais modular, mantível e testável
dev.to
, reduzindo acoplamento e facilitando reutilização de componentes em diferentes contextos.

2. Open/Closed Principle (Aberto/Fechado): Código deve estar aberto para extensões, mas fechado para modificações
github.com
. Isso significa projetar componentes e funções de forma que novas funcionalidades possam ser adicionadas sem alterar o código existente. No frontend, pratique isso criando componentes reutilizáveis e configuráveis via props. Por exemplo, desenvolva um componente de botão genérico que aceita propriedades para estilização e comportamento, em vez de criar variantes quase duplicadas. Assim, quando for necessário um estilo novo, você estende passando novas classes ou propriedades (por exemplo, usando utilitários do Tailwind via prop className), sem precisar modificar o código interno original do componente
dev.to
. Dessa forma, o componente base permanece estável (fechado para alterações internas), mas pode receber novos estilos ou comportamentos via extensão (aberto a extensões).

3. Liskov Substitution Principle (Substituição de Liskov): Componentes derivados ou específicos devem poder substituir componentes genéricos equivalentes sem quebrar a aplicação
dev.to
. Em React, isso se traduz em criar interfaces de componente bem definidas: qualquer componente que implemente certa interface (props) deve poder ser usado no lugar de outro similar. Por exemplo, se você tem um componente base (como um botão genérico) e decide criar uma variação dele, garanta que a variação aceite as mesmas props e respeite o contrato esperado. Assim, onde quer que o componente base seja utilizado, a variação pode ser introduzida sem efeitos colaterais inesperados
dev.to
. Este princípio promove um sistema de componentes unificado e coeso, facilitando substituições e refatorações futuras sem regressões.

4. Interface Segregation Principle (Segregação de Interface): Evite interfaces “inchadas” ou muito genéricas em componentes. Prefira interfaces pequenas e específicas, expondo via props somente o necessário para aquele componente
dev.to
. Em outras palavras, se um componente precisa apenas de título e data, não force passar um objeto complexo inteiro – separe e passe apenas as informações necessárias. Interfaces de componente simples tornam o código mais fácil de entender e modificar, e garantem que componentes permaneçam focados. No contexto de TypeScript/React, isso significa definir tipos ou interfaces de props concisos, e segmentar responsabilidades se um componente estiver recebendo props demais. A regra é: componentes menores e mais focados, com contratos claros, resultam em melhor organização e desempenho do frontend
dev.to
.

5. Dependency Inversion Principle (Inversão de Dependência): Os componentes de alto nível não devem depender diretamente de detalhes de componentes de baixo nível, mas sim de abstrações comuns. Em React/Next, podemos aplicar isso abstraindo lógicas ou APIs externas em serviços ou componentes base, de modo que partes mais elevadas da aplicação dependam dessas abstrações e não de implementações concretas. Por exemplo, se várias telas usam um formulário de “Tarefa”, extrair um componente <TaskForm> genérico ou hook de uso (useTaskForm) que encapsula os campos e lógica, permitindo que telas de “Criar Tarefa” e “Editar Tarefa” apenas forneçam implementações específicas (como o handler de submit) ao formulário genérico
dev.to
dev.to
. Assim, o código de alto nível (páginas de criar/editar) não depende dos detalhes internos de formulário, mas de uma abstração estável. Isso melhora a separação de preocupações e torna o código mais escalável e fácil de manter
dev.to
.

Conceitos de Código Limpo em TypeScript/React

1. Nomenclatura Significativa: Nomeie variáveis, funções e componentes de forma clara e expressiva, refletindo seu propósito
github.com
. Evite abreviações confusas ou nomes genéricos como data ou handleThing. Um bom nome deve tornar óbvia a intenção – por exemplo, use listaClientes em vez de dados para um array de clientes. Além disso, use um vocabulário consistente para a mesma ideia em todo o projeto (ex: não misture getUsuario vs fetchUser vs loadUser para funções equivalentes)
github.com
. Nomes consistentes melhoram a leitura e busca no código, facilitando entender o sistema como um todo.

2. Tamanho e Responsabilidade de Funções/Componentes: Seguindo tanto Clean Code quanto SOLID, mantenha funções e componentes pequenos e focados. Cada função ou componente React deve idealmente fazer uma só coisa – se perceber que ele “e” faz outra coisa, considere refatorar dividindo em partes. Isso aumenta a coesão e facilita testes unitários. Componentes muito grandes ou multifacetados tendem a ser difíceis de entender e dar manutenção. Prefira quebrar interfaces complexas em subcomponentes menores e reutilizáveis. Por exemplo, se um componente de página contém um formulário extenso com várias partes, extraia partes desse formulário (como campos ou seções) em componentes menores.

3. Evite Código Repetido (DRY – Don’t Repeat Yourself): Identifique padrões repetidos no código e extraia para funções utilitárias, componentes comuns ou hooks. Código duplicado não só aumenta o volume, mas também o risco de inconsistências e erros. Por exemplo, se há lógica de formatação de datas usada em vários lugares, coloque-a em uma função utilitária única (ou mesmo em um hook, se envolver estado/efeitos). Assim, qualquer ajuste nessa lógica é feito em um único local, beneficiando toda a aplicação.

4. Simplicidade e Clareza (KISS e YAGNI): Mantenha o design o mais simples possível (Keep It Simple). Não adicione complexidade desnecessária nem funcionalidades “futuras” que não sejam necessárias agora (You Aren’t Gonna Need It). Isso significa evitar super-engenharias – por exemplo, não introduza padrões complexos ou abstrações se a escala do projeto não exige. Um código simples e direto é mais fácil de entender, dar manutenção e evoluir. Se e quando o projeto crescer em requisitos, as abstrações poderão ser introduzidas de forma informada. Lembre-se: clareza é mais importante do que “esperteza” – código claro (mesmo que verboso) costuma ser preferível a um código “inteligente” porém obscuro.

5. Legibilidade e Formatação: Código é lido muito mais vezes do que escrito
github.com
, portanto otimize-o para leitura. Formate de maneira consistente (uso de espaços, quebras de linha, etc.), e utilize ferramentas como o Prettier para padronizar isso automaticamente. Evite “números mágicos” ou strings soltas no código – atribua-os a constantes com nomes significativos para que outros desenvolvedores entendam seu propósito
github.com
. Insira comentários somente quando necessário para explicar “porquê” algo é feito (o “o quê” e “como” devem estar evidentes pelo próprio código); comentários desatualizados ou desnecessários podem atrapalhar mais do que ajudar. Esforce-se para escrever código autodocumentado, onde a intenção fica clara pelos nomes e estrutura.

Arquitetura de Projeto Recomendada

1. Organização por Domínio/Funcionalidade: Estruture o projeto agrupando código por domínios de negócio ou features, ao invés de apenas por tipo técnico de arquivo. Uma abordagem escalável é dividir em camadas de Core e Domain. Coloque no núcleo (core) tudo que é transversal ou genérico ao negócio – por exemplo, utilitários, configurações, funções de acesso a banco/API, provedores de autenticação, e componentes UI genéricos (botão, input) que não carregam regras de negócio específicas
giancarlobuomprisco.com
. Já a camada de Domínio conterá a lógica e componentes específicos de cada contexto de negócio (ex.: Tarefas, Usuários, Clientes). Dentro de cada domínio, pode-se ter subpastas para componentes, hooks, serviços e outros itens relacionados àquela funcionalidade
giancarlobuomprisco.com
. Por exemplo, você poderia ter: src/lib/tarefas/ contendo hooks, funções e contexto relacionados a tarefas (p. ex. useListaTarefas, serviços de API de tarefas, etc.), e src/components/tarefas/ com componentes de UI das tarefas (p. ex. TabelaTarefas, FormularioTarefa)
giancarlobuomprisco.com
giancarlobuomprisco.com
. Essa separação reforça a coesão dentro de cada domínio e diminui dependências indevidas entre partes diferentes do sistema.

2. Camada de Core (Infraestrutura): Na raiz do src/ (ou do projeto), tenha uma estrutura dedicada a recursos de infraestrutura e utilidades compartilhadas pelo projeto. Aqui entram itens como: configurações (ex.: tema do Tailwind, contexto de autenticação global), utilitários genéricos (funções de formatação, validações comuns), integrações de APIs externas ou conexão com banco (no caso de Next API routes), e componentes de UI atômicos reutilizáveis (botões genéricos, componentes de formulário básicos) que não estão ligados a nenhuma lógica de negócio específica
giancarlobuomprisco.com
. Essa camada core fornece ferramentas para os domínios, mas não conhece detalhes dos domínios – inclusive, deve-se evitar que o core importe módulos de domínios de negócio
giancarlobuomprisco.com
. Isso garante que o núcleo seja potencialmente reutilizável e independente.

3. Lib (Lógica de Domínio) e Componentes: Conforme mencionado, dentro de cada domínio (feature) podemos separar a lógica e a UI. Uma convenção útil é ter pastas como lib/<domínio> e components/<domínio>. Em lib/<domínio>/ coloque a lógica daquele domínio: hooks específicos, services (funções de chamada à API relacionadas), models ou adapters de dados, e contextos (React Context) se houver
giancarlobuomprisco.com
. Já em components/<domínio>/, coloque componentes React visuais ou de composição mais complexa próprios daquele domínio (por exemplo, tabelas, formulários, cards relacionados à entidade em questão)
giancarlobuomprisco.com
. Essa estrutura física de pastas por funcionalidade torna mais fácil encontrar tudo relativo a, digamos, “Tarefas” em um só lugar, melhorando a manutenibilidade. Opcionalmente, dentro de cada domínio você pode criar subpastas para categorizar por tipo (ex.: components/tarefas/forms/, components/tarefas/cards/ ou lib/tarefas/hooks/, lib/tarefas/dtos/, etc.), conforme a necessidade e tamanho do módulo
giancarlobuomprisco.com
. Importante: Use a funcionalidade de path aliases do TypeScript/Next (ex.: @/lib/tarefas) para importar facilmente sem caminhos relativos confusos.

4. Next.js App Router (Rotas e Páginas): No Next.js (usando App Router), a pasta app/ define a estrutura de rotas da aplicação. Organize as rotas também por domínio ou escopo de funcionalidade. Por exemplo, você pode ter um grupo de rotas protegido para o app principal (app/(app)/...), rotas de marketing/públicas (app/(marketing)/...), rotas de autenticação (app/auth/), etc., utilizando a técnica de agrupar rotas em pastas e segmentos nomeados claramente (por exemplo, app/tarefas/page.tsx para lista de tarefas, app/tarefas/[id]/page.tsx para detalhe da tarefa). Dentro das páginas, mantenha a lógica mínima necessária – obtenha dados no servidor (usando fetch em componentes Server ou use em async components) e delegue a renderização para componentes do domínio (importados de components/...). Aproveite os Layouts e Templates do Next.js App Router para definir estruturas comuns (como navigation, rodapé) e separar preocupações de layout vs. conteúdo de página.

5. Exemplo de Estrutura de Pastas: A título ilustrativo, uma estrutura poderia ser:
