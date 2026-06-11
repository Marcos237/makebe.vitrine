# AGENTS.md

## Objetivo
Este projeto utiliza React + TypeScript com arquitetura modular.

Sempre seguir exatamente a estrutura abaixo ao criar novas features.

---

# Estrutura do Projeto

src/
├── assets/
├── components/
├── componentsGenerics/
├── config/
├── constants/
├── features/
├── functions/
├── hooks/
├── Interfaces/
├── mocks/
├── services/
├── utils/

---

# Regras

## Components
- Componentes reutilizáveis ficam em:
  src/components

- Componentes genéricos compartilhados ficam em:
  src/componentsGenerics

## Features
Cada funcionalidade deve ficar dentro de:
src/features/NomeFeature

Estrutura padrão:

src/features/Login/
├── components/
├── hooks/
├── services/
├── interfaces/
├── pages/
├── styles/
└── index.ts

## Services
- Todas chamadas de API devem ficar em:
  src/services

- Utilizar axios.

## Config
- URLs da API devem ficar em:
  src/config/apiConfig.ts

Exemplo:

```ts
export const API_BASE_URL = "https://localhost:44340/"