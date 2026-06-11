# Agenda

## Campo Periodo

O campo `periodo` representa a duração do atendimento em horas decimais.

Exemplos:

| periodo | duração     |
| ------- | ----------- |
| 0.10    | 6 minutos   |
| 0.25    | 15 minutos  |
| 0.50    | 30 minutos  |
| 1.00    | 60 minutos  |
| 2.00    | 120 minutos |

Conversão:

```typescript
const minutos = periodo * 60;
```

---

## Geração dos Horários

Os horários devem ser gerados utilizando:

* agendaAbertaInicio
* agendaAbertaFim
* periodo do serviço selecionado

Exemplo:

```json
{
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
23:00
```

Exemplo:

```json
{
  "periodo": 0.50
}
```

Resultado:

```text
00:00
00:30
01:00
01:30
...
23:30
```

### Regras

* Utilizar objetos Date para cálculos.
* Não utilizar manipulação de strings para cálculos de horário.
* Os horários devem ser gerados apenas dentro da janela aberta da agenda.
* Não gerar horários fora da agenda aberta.

---

## Seleção de Serviço

O serviço determina o período utilizado para geração dos horários.

Sempre que o serviço for alterado:

* Limpar horário selecionado.
* Recalcular todos os horários.
* Reaplicar bloqueios.
* Reaplicar ocupações.

Exemplo:

```text
Corte Feminino = 30 minutos
Coloração = 90 minutos
```

A troca de serviço altera os horários disponíveis.

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

Um slot é considerado ocupado quando:

```text
slotInicio < dataTerminoAgendamento
E
slotFim > dataInicioAgendamento
```

Exemplo:

Agendamento:

```text
13:00 - 14:00
```

Slot:

```text
13:30 - 14:30
```

Resultado:

```json
{
  "ocupado": true
}
```

Não comparar apenas o horário inicial.

Sempre considerar o intervalo completo.

---

## Bloqueios de Agenda

Quando existir:

```json
{
  "agendaBloqueadaInicio": "2026-05-26T12:00:00",
  "agendaBloqueadaFim": "2026-05-26T13:00:00"
}
```

Os horários compreendidos dentro do intervalo devem ser marcados como bloqueados.

Exemplo:

```json
{
  "hora": "12:00",
  "bloqueado": true
}
```

### Regra de Bloqueio

Um slot é considerado bloqueado quando:

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

O sistema nunca deve permitir seleção ou agendamento de horários bloqueados ou ocupados.

---

## Fluxo da Tela

1. Carregar agenda do colaborador.
2. Selecionar uma data válida.
3. Selecionar um serviço.
4. Gerar horários conforme o período do serviço.
5. Aplicar bloqueios.
6. Aplicar ocupações.
7. Exibir horários disponíveis.
8. Permitir seleção apenas de horários disponíveis.
9. Habilitar o botão Agendar somente quando houver:

   * Data selecionada
   * Serviço selecionado
   * Horário disponível selecionado

---

## Regra Importante

A agenda nunca deve utilizar uma grade fixa de horários.

Todos os horários devem ser gerados dinamicamente a partir do período do serviço selecionado.
