# Módulo Base de Conhecimento

O módulo Base de Conhecimento permite o upload, gerenciamento e busca de arquivos e datasets para alimentar os chatbots e sistemas de resposta automática.

## Funcionalidades

- Upload de arquivos PDF
- Gerenciamento de datasets
- Busca textual na base
- Visualização de status de processamento

## Fluxo de Uso

1. Acesse o menu "Base de Conhecimento" no painel lateral.
2. Faça upload de arquivos PDF para criar ou alimentar uma base.
3. Gerencie os datasets existentes (renomear, excluir, visualizar status).
4. Realize buscas textuais na base para testar o conhecimento indexado.

## Principais Componentes

- `KnowledgeBaseDatasetUpload.tsx`: Página de upload de arquivos.
- `KnowledgeBaseManagement.tsx`: Página de gerenciamento de datasets.
- `KnowledgeBaseSearch.tsx`: Página de busca textual na base.
- `FileUploadModal.tsx`: Modal para upload de arquivos.

## Tipos Principais

```ts
// src/types/knowledge.ts (exemplo)
export interface KnowledgeDataset {
  id: string;
  name: string;
  status: 'processing' | 'ready' | 'error';
  createdAt: string;
  updatedAt: string;
}
```

## Integração com API

- Upload: `POST /datasets/upload`
- Listagem: `GET /datasets`
- Busca: `POST /datasets/search`

## Observações Técnicas

- Utiliza TanStack Query para gerenciamento de dados e cache.
- Upload de arquivos com validação de formato e tamanho.
- Busca textual otimizada para grandes volumes de dados.

## Exemplo de Resposta da API

```json
{
  "id": "...",
  "name": "Base Exemplo",
  "status": "ready",
  "createdAt": "2025-06-12T23:57:53.138Z",
  "updatedAt": "2025-06-12T23:57:53.978Z"
}
``` 