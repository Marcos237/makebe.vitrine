# Agenda

## Objetivo

Gerar horários disponíveis para agendamento utilizando o período do serviço selecionado.

---

## Campo Periodo

O campo `periodo` NÃO representa horas decimais.

O valor utiliza o formato:

```text
HH.MM
```

Onde:

* HH = horas
* MM = minutos

Exemplos:

| periodo | duração     |
| ------- | ----------- |
| 0.10    | 10 minutos  |
| 0.30    | 30 minutos  |
| 0.59    | 59 minutos  |
| 1.00    | 60 minutos  |
| 1.29    | 89 minutos  |
| 2.15    | 135 minutos |

---

## Conversão do Período

Exemplo:

```json
{
  "periodo": 1.29
}
```

Resultado:

```text
1 hora e 29 minutos
89 minutos
```

Implementação esperada:

```typescript
const horas = Math.floor(periodo);

const minutos = Math.round(
  (periodo - horas) * 100
);

const totalMinutos =
  (horas * 60) + minutos;
```

---

## Seleção de Serviço

O serviço define a duração do atendimento.

Sempre que o serviço for alterado:

* Limpar horário selecionado.
* Recalcular horários disponíveis.
* Reaplicar bloqueios.
* Reaplicar ocupações.

Nenhum horário deve ser exibido antes da seleção de um serviço.

---

## Geração dos Horários

Os horários devem ser gerados utilizando:

* data selecionada
* agendaAbertaInicio
* agendaAbertaFim
* período do serviço selecionado

Exemplo:

```json
{
  "descricao": "Corte Infantil",
  "periodo": 0.59
}
```

Resultado:

```text
00:00
00:59
01:58
02:57
03:56
...
```

Exemplo:

```json
{
  "descricao": "Corte Feminino",
  "periodo": 1.00
}
```

Resultado:

```text
00:00
01:00
02:00
03:00
...
```

Os horários devem ser gerados utilizando objetos Date.

Não utilizar manipulação de strings para cálculos de tempo.

---

## Horários Ocupados

Os horários já agendados devem permanecer marcados como ocupados.

Exemplo:

```json
{
  "dataInicioAgendamento": "2026-05-28T13:01:00",
  "dataTerminoAgendamento": "2026-05-28T14:01:00"
}
```

### Regra de Colisão

Um horário é considerado ocupado quando:

```text
slotInicio < dataTerminoAgendamento
E
slotFim > dataInicioAgendamento
```

Exemplo:

Agendamento:

```text
13:01 - 14:01
```

Slot:

```text
13:00 - 13:59
```

Resultado:

```json
{
  "ocupado": true
}
```

---

## Bloqueios de Agenda

Quando existir:

```json
{
  "agendaBloqueadaInicio": "2026-05-26T12:00:00",
  "agendaBloqueadaFim": "2026-05-26T13:00:00"
}
```

Todos os horários compreendidos nesse intervalo devem ser marcados como bloqueados.

### Regra de Bloqueio

Um horário é considerado bloqueado quando:

```text
slotInicio < agendaBloqueadaFim
E
slotFim > agendaBloqueadaInicio
```

---

## Estrutura Esperada

```json
[
  {
    "hora": "08:00",
    "ocupado": false,
    "bloqueado": false,
    "disponivel": true
  },
  {
    "hora": "09:00",
    "ocupado": true,
    "bloqueado": false,
    "disponivel": false
  },
  {
    "hora": "10:00",
    "ocupado": false,
    "bloqueado": true,
    "disponivel": false
  }
]
```

---

## Regra de Exibição

Prioridade:

1. Bloqueado
2. Ocupado
3. Disponível

O sistema nunca deve permitir agendamento em horários bloqueados ou ocupados.

---

## Fluxo da Tela

1. Carregar agenda do colaborador.
2. Selecionar uma data válida.
3. Selecionar um serviço.
4. Gerar horários utilizando o período do serviço.
5. Aplicar bloqueios.
6. Aplicar ocupações.
7. Exibir horários disponíveis.
8. Permitir seleção apenas de horários disponíveis.
9. Habilitar o botão Agendar somente quando houver:

   * Data selecionada
   * Serviço selecionado
   * Horário selecionado

---

## Regra Importante

A agenda nunca deve utilizar uma grade fixa de horários.

Todos os horários devem ser gerados dinamicamente a partir do período do serviço selecionado.
