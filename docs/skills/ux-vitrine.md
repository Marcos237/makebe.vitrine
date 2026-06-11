# Melhorias de UX e Navegação

## Objetivo

Implementar melhorias de experiência do usuário (UX) na aplicação, mantendo integralmente o padrão visual, componentes, arquitetura e regras de negócio já existentes.

Não alterar fluxos funcionais atuais além das melhorias descritas abaixo.

## Botão "Meus Agendamentos"

Localizar a área onde atualmente é exibido o botão **Agendar**.

### Regra

Quando o usuário estiver autenticado:

* Manter o botão **Agendar**.
* Exibir ao lado o botão **Meus Agendamentos**.
* Utilizar o mesmo padrão visual da aplicação.
* Respeitar espaçamentos, alinhamentos e responsividade já existentes.

### Navegação

Ao clicar em **Meus Agendamentos**:

* Navegar para a página de Meus Agendamentos.
* Utilizar o mecanismo de navegação já adotado no projeto.
* Não realizar recarregamento completo da página.

### Usuário não autenticado

Quando o usuário não estiver autenticado:

* Exibir apenas o botão Agendar.
* Não exibir o botão Meus Agendamentos.

## Espaçamentos entre seções

Revisar os espaçamentos verticais e horizontais das principais seções da página.

Objetivos:

* Melhorar a leitura visual.
* Reduzir sensação de elementos muito próximos.
* Tornar a navegação mais confortável.

### Regras

* Utilizar o sistema de espaçamento já existente.
* Não criar novos padrões visuais.
* Manter consistência com o restante da aplicação.
* Preservar responsividade em desktop, tablet e mobile.

## Carrossel de imagens

Identificar o componente responsável pelo carrossel/banner principal.

### Melhorias

Avaliar e implementar melhorias de UX:

* Transições mais suaves.
* Melhor responsividade.
* Melhor comportamento em dispositivos móveis.
* Melhor experiência de navegação.

### Tempo de troca

Diminuir o tempo entre as trocas automáticas das imagens.

Objetivo:

* Tornar o conteúdo mais dinâmico.
* Evitar permanência excessiva da mesma imagem.

Utilizar um tempo equilibrado para não prejudicar a leitura do conteúdo.

## Navegação do carrossel

Caso o componente suporte:

* Melhorar indicadores de página.
* Melhorar botões anterior/próximo.
* Melhorar acessibilidade.
* Melhorar feedback visual durante a navegação.

Sempre respeitando os padrões já utilizados no projeto.

## Restrições

* Não alterar regras de negócio.
* Não modificar APIs.
* Não alterar contratos existentes.
* Não alterar fluxos de autenticação.
* Não alterar funcionalidades já implementadas.
* Não criar novos padrões visuais fora do design system atual.

## Critérios de aceite

* Usuário autenticado visualiza o botão Meus Agendamentos ao lado do botão Agendar.
* Usuário não autenticado não visualiza o botão Meus Agendamentos.
* O botão Meus Agendamentos navega corretamente para a página correspondente.
* Os espaçamentos entre seções foram melhorados sem quebrar o layout.
* O carrossel apresenta melhor experiência visual.
* O tempo de troca das imagens foi reduzido.
* A aplicação permanece responsiva.
* Nenhuma funcionalidade existente foi impactada.
