# Skill: Desativar Agendamento no Front-End

## Objetivo

Implementar o fluxo de desativação de agendamento na tela de agendamentos.

## Comportamento Esperado

Ao clicar no botão **Excluir** de um agendamento:

1. Exibir um popup de confirmação compatível com Desktop e Mobile.
2. Exibir a mensagem:

```text
Deseja excluir esse agendamento?
```

3. Exibir os botões:

```text
Sim
Não
```

4. Ao clicar em **Não**:

   * Fechar o popup.
   * Não executar nenhuma ação adicional.

5. Ao clicar em **Sim**:

   * Chamar a API:

```http
POST /colaborador-agendamento/desativar
```

6. Enviar no body o DTO esperado pela API:

```json
{
  "id": 123
}
```

Utilizar o Id do agendamento selecionado.

## Endpoint

```csharp
[HttpPost("colaborador-agendamento/desativar")]
public async Task<IActionResult> DesativarAsync(
    [FromBody] DesativarAgendamentoRequestDto request,
    CancellationToken cancellationToken)
```

## Requisitos Técnicos

### Popup

* Utilizar o componente de modal já existente no projeto.
* Caso exista componente padrão de confirmação, reutilizá-lo.
* O popup deve funcionar corretamente em Desktop e Mobile.
* O popup deve possuir tratamento de loading durante a chamada da API.
* Impedir múltiplos cliques enquanto a requisição estiver em andamento.

### Chamada da API

* Seguir o padrão atual de consumo de APIs do projeto.
* Utilizar os serviços, hooks ou clients já existentes.
* Não criar implementações paralelas caso já exista padrão estabelecido.

### Tratamento de Sucesso

Quando a API retornar sucesso:

1. Fechar o popup.
2. Exibir mensagem de sucesso utilizando o padrão atual do sistema.
3. Atualizar a listagem de agendamentos.

Preferencialmente:

```typescript
refetch();
```

Caso não exista mecanismo de atualização:

```typescript
window.location.reload();
```

### Tratamento de Erro

Quando ocorrer erro:

1. Fechar o estado de loading.
2. Exibir mensagem amigável ao usuário.
3. Não atualizar a página.
4. Manter a tela atual.

## Critérios de Aceitação

* Botão Excluir abre popup de confirmação.
* Popup exibe "Deseja excluir esse agendamento?".
* Botões Sim e Não funcionando.
* API de desativação sendo chamada corretamente.
* Id do agendamento enviado corretamente.
* Loading durante processamento.
* Prevenção de múltiplos cliques.
* Mensagem de sucesso após exclusão.
* Atualização automática da listagem após sucesso.
* Compatível com Desktop e Mobile.
* Seguir rigorosamente os componentes e padrões já existentes no projeto.

## Entrega

Ao finalizar:

1. Informar os arquivos alterados.
2. Informar os arquivos criados.
3. Explicar onde foi implementada a abertura do modal.
4. Explicar onde foi implementada a chamada da API.
5. Explicar como a tela é atualizada após o sucesso.
