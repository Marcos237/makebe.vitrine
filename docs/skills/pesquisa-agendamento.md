# Skill: Criar Página de Pesquisa da Vitrine

## Objetivo

Criar uma nova página de pesquisa na Vitrine permitindo que o usuário encontre lojas, profissionais e serviços através de uma busca unificada.

A implementação deve seguir rigorosamente os padrões visuais, componentes, arquitetura, responsividade, UX e organização já existentes no projeto.

---

## Regras de Negócio

O usuário poderá pesquisar por:

- Nome do profissional
- Nome da loja
- Nome do serviço
- Descrição do serviço
- Categoria

A pesquisa deve utilizar o endpoint:

```http
GET /vitrine/pesquisa?termo={texto}
```

Exemplo:

```http
GET /vitrine/pesquisa?termo=corte
```

---

## Layout da Página

Criar uma página contendo:

### Cabeçalho

Título:

```text
Encontre o serviço ideal
```

Subtítulo:

```text
Pesquise por profissionais, lojas, categorias ou serviços.
```

---

### Campo de Pesquisa

Utilizar o componente padrão de input já existente no projeto.

Placeholder:

```text
O que você está procurando?
```

Exemplos:

```text
Corte masculino
Barba
Maria
Studio Hair
Estética facial
```

A pesquisa deve ser executada:

- Ao pressionar ENTER
- Ao clicar no botão Pesquisar
- Opcionalmente utilizando debounce de 500ms

---

## Integração

Endpoint:

```csharp
[HttpGet("pesquisa")]
public async Task<IActionResult> GetAsync(string termo, CancellationToken cancellationToken)
```

Retorno:

```csharp
public class ItemVitrineResponse
{
    public string? RazaoSocial { get; set; }
    public string? DescricaoCategoria { get; set; }
    public string? UrlImagem { get; set; }
    public int IdLoja { get; set; }
}
```

---

## Exibição dos Resultados

Os resultados devem ser exibidos em formato de cards.

Seguir exatamente o visual dos cards já utilizados na Vitrine.

Cada card deve conter:

### Imagem

Utilizar:

```text
UrlImagem
```

Caso não exista imagem:

```text
Exibir imagem padrão do sistema
```

A imagem deve ocupar toda a área superior do card.

Utilizar:

```css
object-fit: cover;
width: 100%;
height: 220px;
```

---

### Conteúdo

Título:

```text
RazaoSocial
```

Subtítulo:

```text
DescricaoCategoria
```

---

## Comportamento do Card

Ao clicar em um card:

Utilizar:

```text
IdLoja
```

para buscar os profissionais da loja.

Endpoint:

```http
GET /vitrine/colaborador-profissional?lojaId={IdLoja}
```

Controller:

```csharp
[HttpGet("colaborador-profissional")]
public async Task<IActionResult> PublishAsync(
    int lojaId,
    CancellationToken cancellationToken)
```

---

## Fluxo Após Clique

1. Usuário clica no card.
2. Buscar profissionais da loja.
3. Seguir exatamente o mesmo fluxo já existente da Vitrine.
4. Abrir a página da loja.
5. Não criar um fluxo novo.
6. Reutilizar o fluxo atual de navegação.

---

## Estados da Tela

### Carregando

Enquanto a API estiver respondendo:

Exibir Skeleton.

Quantidade:

```text
6 cards
```

Utilizar o mesmo Skeleton já utilizado no projeto.

---

### Sem Resultado

Caso nenhum registro seja encontrado:

```text
Nenhum resultado encontrado.
Tente pesquisar utilizando outros termos.
```

Utilizar componente Empty State já existente.

---

### Erro

Caso ocorra falha:

```text
Não foi possível realizar a pesquisa.
Tente novamente.
```

Utilizar componente padrão de erro do projeto.

---

## UX

Ao abrir a página:

- Focar automaticamente no campo de pesquisa.

Após pesquisar:

- Manter o valor digitado.
- Exibir quantidade de resultados encontrados.

Exemplo:

```text
18 resultados encontrados
```

Após retornar os resultados:

- Fazer scroll automático até a área dos cards.

Permitir:

- Nova pesquisa sem recarregar a página.

---

## Responsividade

Desktop:

```text
4 cards por linha
```

Tablet:

```text
2 cards por linha
```

Mobile:

```text
1 card por linha
```

---

## Requisitos Técnicos

Obrigatório reutilizar:

- Componentes de Card
- Componentes de Input
- Componentes de Grid
- Componentes de Skeleton
- Componentes de Loading
- Componentes de Mensagens

Não criar componentes duplicados quando já existir equivalente no projeto.

Seguir a arquitetura atual:

- Pages
- Services
- Hooks
- DTOs
- Models
- Components

---

## Design

A nova página deve respeitar:

- Paleta de cores atual
- Tipografia atual
- Espaçamentos atuais
- Bordas atuais
- Hover dos cards
- Sombras dos cards
- Responsividade atual

A aparência final deve parecer uma continuação natural da Vitrine existente.

---

## Critérios de Aceite

- Pesquisa por profissional funcionando.
- Pesquisa por loja funcionando.
- Pesquisa por serviço funcionando.
- Pesquisa por descrição funcionando.
- Pesquisa por categoria funcionando.
- Cards exibindo imagem corretamente.
- Cards exibindo loja e categoria corretamente.
- Responsividade funcionando.
- Skeleton implementado.
- Estado vazio implementado.
- Estado de erro implementado.
- Clique abre a vitrine correta da loja.
- Reutilização dos componentes existentes.
- Seguir rigorosamente o padrão visual e arquitetural do projeto.