# Módulo Crawling

O módulo Crawling permite gerenciar requisições de extração de dados de URLs externas, acompanhar o status e visualizar os resultados processados.

## Funcionalidades

- Listagem de crawlings realizados
- Criação de novo crawling (modal)
- Visualização de detalhes e resultado do crawling
- Paginação e tratamento de estados (loading, erro, vazio)

## Fluxo de Uso

1. Acesse o menu "Crawling" no painel lateral.
2. Clique em "+ Novo Crawling" para abrir o modal de criação.
3. Preencha a URL, selecione os formatos desejados (JSON, Markdown) e, se necessário, insira um JSON Schema.
4. Após criar, acompanhe o status na listagem.
5. Clique em qualquer item da lista para ver detalhes e o resultado do crawling.

## Principais Componentes

- `CrawlingListPage.tsx`: Página de listagem e gerenciamento de crawlings.
- `CrawlingDetailPage.tsx`: Página de detalhes e visualização do resultado do crawling.
- `CreateCrawlingModal.tsx`: Modal para criação de crawling.
- `StatusBadge.tsx`: Exibe o status do crawling.
- `FormatChips.tsx`: Exibe os formatos solicitados (quando aplicável).

## Tipos Principais

```ts
// src/types/crawling.ts
export interface CrawlingRequest {
    url: string;
    formats: ('json' | 'markdown')[];
    jsonSchema?: string;
}

export interface Crawling {
    id: string;
    url: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: {
        success: boolean;
        data: {
            markdown?: string;
            metadata?: Record<string, any>;
        };
    };
    error?: string;
    createdAt: string;
    updatedAt: string;
}
```

## Integração com API

- Listagem: `GET /user/crawling?page=1&limit=10`
- Detalhe: `GET /user/crawling/{id}`
- Criação: `POST /user/crawling`

## Observações Técnicas

- Utiliza TanStack Query para gerenciamento de dados e cache.
- O modal de criação utiliza React Hook Form e Zod para validação.
- O campo de URL foi ajustado para garantir contraste e acessibilidade (`text-gray-900`).
- O sistema trata diferentes formatos de resposta da API para garantir robustez e compatibilidade.

## Exemplo de Resposta da API

```json
{
  "id": "...",
  "url": "https://exemplo.com",
  "status": "completed",
  "result": {
    "success": true,
    "data": {
      "markdown": "...",
      "metadata": { "title": "Exemplo" }
    }
  },
  "createdAt": "2025-06-12T23:57:53.138Z",
  "updatedAt": "2025-06-12T23:57:53.978Z"
}
``` 