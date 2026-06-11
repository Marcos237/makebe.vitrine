# Implementar fluxo MeusAgendamentos

## Objetivo

Criar uma nova página React chamada **MeusAgendamentos** para exibir os agendamentos do usuário.

## Regras obrigatórias

* Seguir exatamente o padrão visual já existente na aplicação.
* Utilizar as mesmas cores, componentes, espaçamentos, tipografia e estrutura de layout já adotados no projeto.
* Não alterar nenhuma regra de negócio existente.
* Não modificar rotas, componentes ou fluxos que não estejam relacionados a esta funcionalidade.
* Reutilizar componentes existentes sempre que possível.

## Fluxo inicial

Neste primeiro momento, os dados devem ser mockados localmente.

Criar uma lista simulada contendo:

* Nome do profissional
* Nome do serviço
* Data do agendamento
* Hora do agendamento

Exemplo:

```json
[
  {
    "id": 1,
    "profissional": "Maria Silva",
    "servico": "Limpeza de Pele",
    "dataHora": "2026-06-15T14:00:00"
  },
  {
    "id": 2,
    "profissional": "João Santos",
    "servico": "Massagem Relaxante",
    "dataHora": "2026-06-05T09:00:00"
  }
]
```

## Exibição

A tela deve apresentar uma listagem contendo:

* Dia
* Hora
* Nome do profissional
* Nome do serviço

Os agendamentos devem ser ordenados por data e hora.

Exemplo visual esperado:

```text
15/06/2026
14:00
Profissional: Maria Silva
Serviço: Limpeza de Pele

[Excluir]
```

## Exclusão

Somente agendamentos futuros poderão ser cancelados.

Regra:

```text
Se dataHora > data/hora atual
    Exibir botão "Excluir"
Senão
    Não exibir botão
```

Ao clicar em excluir:

* Remover o item da lista.
* Exibir a mesma mensagem de sucesso/padrão utilizada pela aplicação, caso exista.
* Seguir o padrão já utilizado nos demais fluxos para confirmação de exclusão, se houver.

## Navegação

Após a conclusão do agendamento no fluxo atual:

* Redirecionar automaticamente para a página MeusAgendamentos.
* Manter o padrão de navegação já utilizado na aplicação.
* Não alterar o comportamento atual além do redirecionamento.

## Estrutura esperada

Criar:

* Página MeusAgendamentos
* Arquivo de mock dos agendamentos
* Interface/Type para o agendamento
* Configuração da rota
* Integração com o fluxo de finalização do agendamento

## Preparação para API futura

Estruturar o código para facilitar a substituição do mock por uma API real futuramente.

Exemplo esperado:

```ts
interface Agendamento {
  id: number;
  profissional: string;
  servico: string;
  dataHora: string;
}
```

Criar uma camada de serviço/repositório para que a origem dos dados possa ser alterada futuramente sem impactar a tela.

## Boas práticas

* Utilizar TypeScript.
* Seguir os padrões já existentes do projeto.
* Evitar código duplicado.
* Manter componentes pequenos e reutilizáveis.
* Respeitar eslint, prettier e convenções do projeto.
* Reutilizar componentes visuais já existentes para cards, listas, botões e mensagens.

## Critério de aceite

* A página MeusAgendamentos é acessível pela rota configurada.
* Os dados mockados são exibidos corretamente.
* O nome do profissional é exibido.
* O nome do serviço é exibido.
* Agendamentos passados não exibem botão de exclusão.
* Agendamentos futuros exibem botão de exclusão.
* A exclusão remove o item da tela.
* Após concluir um agendamento, o usuário é redirecionado para MeusAgendamentos.
* Nenhuma funcionalidade existente é impactada.
