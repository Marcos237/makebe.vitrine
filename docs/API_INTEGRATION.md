# API_BANNER_INTEGRATION.md

## Objetivo

Integrar a API real de banners da vitrine no frontend React + TypeScript.

Os dados devem vir diretamente da API.
Não criar mocks.
Não criar dados fake.
Não utilizar dados estáticos.

---

# Endpoint

GET /vitrine/banner

---

# Response

A API retorna dados reais do banco:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "razaoSocial": "Loja X",
      "nomeImagem": "banner.jpg",
      "tituloImagem": "Banner Principal",
      "urlImagem": "https://api.site.com/imagens/banner.jpg"
    }
  ]
}