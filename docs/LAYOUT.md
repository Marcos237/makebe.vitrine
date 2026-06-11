# LAYOUT.md

## Objetivo

Implementar o layout da página Home seguindo o visual do projeto makebeapp.com.br/Home.

O layout deve ser moderno, responsivo e utilizar React + TypeScript + CSS Modules.

---

# Estrutura existente

A aplicação já possui parcialmente:

- Home
- Footer
- Sessões
- vitrine.module.css

Reutilizar ao máximo os componentes existentes.

---

# Tecnologias

- React
- TypeScript
- CSS Modules
- React Router

Não utilizar:
- styled-components
- tailwind
- bootstrap
- jquery

---

# Estrutura esperada

src/features/Home/
├── components/
│   ├── Hero/
│   ├── Carousel/
│   ├── Services/
│   ├── About/
│   ├── Contact/
│   └── CTA/
├── sections/
├── hooks/
├── services/
├── styles/
├── pages/
└── index.ts

---

# Layout

## Hero Section

Criar uma seção principal fullscreen com:

- fundo escuro
- efeito blur/luz azul
- título centralizado

Texto:

Transforme seu visual

Subtexto:

Corte, coloração e cuidados personalizados

Botão:
Agendar agora

---

# Carousel

Criar um carousel horizontal igual ao layout original.

Características:

- imagens grandes
- imagem central destacada
- navegação lateral
- dots inferiores
- transição suave
- responsivo

Altura aproximada:
350px a 450px

Utilizar:
- swiper
ou
- embla-carousel-react

---

# Estilo Visual

Paleta:

- preto
- azul escuro
- azul neon suave
- branco

Visual:
- elegante
- minimalista
- moderno
- premium

---

# Responsividade

Desktop:
- layout centralizado
- carousel largo

Mobile:
- imagens adaptadas
- textos menores
- navegação touch

---

# CSS

Utilizar:

NomeComponente.module.css

Exemplo:

Hero.module.css
Carousel.module.css

Não utilizar CSS global desnecessário.

---

# Regras

- Componentes pequenos
- Separação de responsabilidades
- Não duplicar código
- Utilizar hooks quando necessário
- Tipagem forte
- Não usar any

---

# Objetivo Final

A página deve ficar visualmente semelhante ao layout do makebeapp.com.br/Home.