# Módulo Chatbots

O módulo Chatbots permite gerenciar, criar e configurar chatbots integrados à plataforma, incluindo integrações com serviços externos como N8N.

## Funcionalidades

- Listagem de chatbots cadastrados
- Criação e configuração de chatbots
- Visualização de status do chatbot
- Integração com serviços externos (ex: N8N)

## Fluxo de Uso

1. Acesse o menu "Chatbots" no painel lateral.
2. Visualize a lista de chatbots cadastrados.
3. Clique em "Novo Chatbot" para criar um novo.
4. Configure integrações e parâmetros do chatbot.
5. Visualize o status e detalhes de cada chatbot.

## Principais Componentes

- `ChatbotsPage.tsx`: Página de listagem e gerenciamento de chatbots.
- `ChatbotTable.tsx`: Tabela de exibição dos chatbots.
- `ChatbotForm.tsx`: Formulário de criação/edição de chatbot.
- `N8nConfigForm.tsx`: Formulário de configuração de integração N8N.
- `ChatbotStatusBadge.tsx`: Exibe o status do chatbot.

## Tipos Principais

```ts
// src/types/chatbot.ts
export interface Chatbot {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  integrationType: 'n8n' | 'custom';
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

## Integração com API

- Listagem: `GET /chatbots`
- Detalhe: `GET /chatbots/{id}`
- Criação: `POST /chatbots`
- Atualização: `PUT /chatbots/{id}`

## Observações Técnicas

- Utiliza TanStack Query para gerenciamento de dados e cache.
- Formulários usam React Hook Form e Zod para validação.
- Suporte a múltiplos tipos de integração.

## Exemplo de Resposta da API

```json
{
  "id": "...",
  "name": "Meu Chatbot",
  "status": "active",
  "integrationType": "n8n",
  "config": { "webhookUrl": "..." },
  "createdAt": "2025-06-12T23:57:53.138Z",
  "updatedAt": "2025-06-12T23:57:53.978Z"
}
``` 