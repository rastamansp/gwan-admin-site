# Módulos do GWAN Admin Site

## 📦 Visão Geral dos Módulos

O GWAN Admin Site é organizado em módulos independentes, cada um responsável por uma funcionalidade específica do sistema. Esta modularização garante:

- **Separação clara de responsabilidades**
- **Facilidade de manutenção**
- **Reutilização de código**
- **Testabilidade independente**
- **Escalabilidade**

## 🔐 Auth Module

### Propósito
Gerenciamento completo de autenticação e autorização do sistema.

### Estrutura
```
src/modules/auth/
├── pages/
│   ├── Login.tsx              # Página de login
│   ├── Register.tsx           # Página de registro
│   ├── Verify.tsx             # Verificação de email
│   └── VerifyLogin.tsx        # Verificação de login
├── components/
│   └── ProtectedRoute.tsx     # Rota protegida
├── hooks/
│   └── useAuth.ts             # Hook de autenticação
├── services/
│   └── auth.service.ts        # Serviço de autenticação
└── types/
    └── auth.types.ts          # Tipos de autenticação
```

### Funcionalidades

#### Autenticação
- **Login com email**: Sistema de login sem senha
- **Verificação por código**: Código enviado por email
- **Registro de usuário**: Criação de nova conta
- **Verificação de conta**: Ativação via email

#### Autorização
- **Rotas protegidas**: Controle de acesso
- **Sessão persistente**: Manutenção do estado de login
- **Logout seguro**: Limpeza de dados de sessão

### Tipos Principais

```typescript
export interface UserSession {
  id: string;
  email: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name: string;
  description?: string;
}
```

### Hook Principal

```typescript
export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = useCallback(async (email: string, code?: string) => {
    // Lógica de login
  }, []);
  
  const logout = useCallback(async () => {
    // Lógica de logout
  }, []);
  
  return { user, isLoading, login, logout };
}
```

## 🤖 Chatbots Module

### Propósito
Gerenciamento completo de chatbots, incluindo criação, configuração e monitoramento.

### Estrutura
```
src/modules/chatbots/
├── pages/
│   ├── ChatbotsPage.tsx       # Lista principal de chatbots
│   └── ChatbotList.tsx        # Lista simplificada
├── components/
│   ├── ChatbotForm.tsx        # Formulário de criação/edição
│   ├── ChatbotTable.tsx       # Tabela de chatbots
│   ├── ChatbotStatusBadge.tsx # Badge de status
│   ├── VectorConfigForm.tsx   # Configuração de vetores
│   └── N8nConfigForm.tsx      # Configuração N8N
├── hooks/
│   └── useChatbotService.ts   # Hook de serviço
├── services/
│   └── chatbot.service.ts     # Serviço de chatbots
└── types/
    └── chatbot.ts             # Tipos de chatbot
```

### Funcionalidades

#### Gerenciamento de Chatbots
- **Criação**: Formulário completo com validação
- **Edição**: Modificação de configurações
- **Exclusão**: Remoção segura com confirmação
- **Listagem**: Tabela com paginação e filtros

#### Configurações
- **Configuração de vetores**: Integração com sistemas de IA
- **Configuração N8N**: Automação de workflows
- **Configuração de prompts**: Templates de conversação

### Tipos Principais

```typescript
export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  status: ChatbotStatus;
  vectorConfig?: VectorConfig;
  n8nConfig?: N8nConfig;
  createdAt: string;
  updatedAt: string;
}

export type ChatbotStatus = 'active' | 'inactive' | 'error' | 'processing';
```

## 🕷️ Crawling Module

### Propósito
Sistema de crawling de dados web com suporte a múltiplos formatos.

### Estrutura
```
src/modules/crawling/
├── pages/
│   ├── CrawlingListPage.tsx   # Lista de crawlings
│   └── CrawlingDetailPage.tsx # Detalhes do crawling
├── components/
│   ├── CreateCrawlingModal.tsx # Modal de criação
│   ├── StatusBadge.tsx         # Badge de status
│   └── FormatChips.tsx         # Seleção de formato
├── hooks/
│   └── useCrawling.ts          # Hook de crawling
├── services/
│   └── crawling.service.ts     # Serviço de crawling
└── types/
    └── crawling.ts             # Tipos de crawling
```

### Funcionalidades

#### Crawling de Dados
- **Criação de jobs**: Definição de URLs e formatos
- **Monitoramento**: Acompanhamento de status em tempo real
- **Resultados**: Visualização e download de dados
- **Histórico**: Lista de crawlings executados

#### Formatos Suportados
- **JSON**: Dados estruturados
- **Markdown**: Texto formatado
- **CSV**: Dados tabulares

### Tipos Principais

```typescript
export interface Crawling {
  id: string;
  url: string;
  status: CrawlingStatus;
  formats: CrawlingFormat[];
  result?: CrawlingResult;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export type CrawlingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type CrawlingFormat = 'json' | 'markdown';
```

## 📚 Knowledge Module

### Propósito
Gerenciamento de bases de conhecimento para treinamento de IA.

### Estrutura
```
src/modules/knowledge/
├── pages/
│   ├── KnowledgeBaseManagement.tsx    # Gerenciamento de bases
│   ├── KnowledgeBaseSearch.tsx        # Busca por similaridade
│   └── KnowledgeBaseDatasetUpload.tsx # Upload de datasets
├── components/
│   └── KnowledgeBaseSidebar.tsx       # Sidebar de navegação
├── services/
│   ├── knowledge.service.ts           # Serviço de conhecimento
│   └── dataset.service.ts             # Serviço de datasets
└── types/
    └── knowledge.ts                   # Tipos de conhecimento
```

### Funcionalidades

#### Bases de Conhecimento
- **Criação**: Definição de novas bases
- **Upload**: Carregamento de arquivos PDF
- **Processamento**: Extração de conhecimento
- **Busca**: Pesquisa por similaridade

#### Datasets
- **Gerenciamento**: Lista e organização de arquivos
- **Validação**: Verificação de formatos e tamanhos
- **Processamento**: Extração de texto e metadados

### Tipos Principais

```typescript
export interface KnowledgeBase {
  _id: string;
  name: string;
  description: string;
  status: 'new' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface SimilarResult {
  id: string;
  content: string;
  enable: boolean;
  meta: {
    fileName: string;
    chunkIndex: number;
    totalChunks: number;
    processedAt: string;
  };
}
```

## 📊 Dashboard Module

### Propósito
Dashboard principal com métricas e visão geral do sistema.

### Estrutura
```
src/modules/dashboard/
├── pages/
│   └── Dashboard.tsx          # Dashboard principal
└── components/
    └── (componentes futuros)  # Métricas e gráficos
```

### Funcionalidades

#### Métricas
- **Usuários ativos**: Contagem de usuários logados
- **Chatbots ativos**: Número de chatbots funcionando
- **Crawlings recentes**: Últimos jobs executados
- **Bases de conhecimento**: Status das bases

#### Visualizações
- **Gráficos**: Tendências e estatísticas
- **Cards informativos**: Resumos rápidos
- **Tabelas**: Dados detalhados

## 👤 User Profile Module

### Propósito
Gerenciamento de perfil do usuário logado.

### Estrutura
```
src/modules/user-profile/
├── pages/
│   └── UserProfile.tsx        # Página de perfil
└── components/
    └── (componentes futuros)  # Componentes de perfil
```

### Funcionalidades

#### Perfil do Usuário
- **Visualização**: Dados atuais do usuário
- **Edição**: Modificação de informações
- **Validação**: Verificação de dados
- **Persistência**: Salvamento de alterações

## 🔄 Comunicação Entre Módulos

### Padrões de Integração

#### 1. Serviços Compartilhados
```typescript
// Módulo A usa serviço do Módulo B
import { IAuthService } from '../auth/types/auth.types';

export class ChatbotService {
  constructor(private authService: IAuthService) {}
  
  async createChatbot(data: CreateChatbotDto) {
    const user = await this.authService.getCurrentUser();
    // Lógica de criação
  }
}
```

#### 2. Hooks Compartilhados
```typescript
// Hook global usado por múltiplos módulos
export function useAuth() {
  // Implementação
}

// Usado em diferentes módulos
export function ChatbotList() {
  const { user } = useAuth();
  // Renderização
}
```

#### 3. Tipos Compartilhados
```typescript
// Tipos globais usados por múltiplos módulos
export interface User {
  id: string;
  email: string;
  name: string;
}

// Usado em auth, user-profile, etc.
```

## 🧪 Testabilidade

### Estrutura de Testes por Módulo

```
tests/
├── unit/
│   ├── auth/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── components/
│   ├── chatbots/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── components/
│   └── knowledge/
│       ├── services/
│       ├── hooks/
│       └── components/
├── integration/
└── e2e/
```

### Exemplo de Teste de Módulo

```typescript
// tests/unit/auth/services/auth.service.test.ts
describe('AuthService', () => {
  let authService: AuthService;
  let mockHttpService: jest.Mocked<IHttpService>;

  beforeEach(() => {
    mockHttpService = createMockHttpService();
    authService = new AuthService(mockHttpService);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      // Teste de login
    });

    it('should handle login errors', async () => {
      // Teste de erro
    });
  });
});
```

## 📈 Performance

### Otimizações por Módulo

#### 1. Code Splitting
```typescript
// Carregamento sob demanda
const ChatbotsPage = lazy(() => import('./modules/chatbots/pages/ChatbotsPage'));
const KnowledgePage = lazy(() => import('./modules/knowledge/pages/KnowledgePage'));
```

#### 2. Caching
```typescript
// Cache específico por módulo
export const useChatbots = () => {
  return useQuery({
    queryKey: ['chatbots'],
    queryFn: () => chatbotService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
```

#### 3. Memoização
```typescript
// Componentes otimizados
export const ChatbotList = memo(({ chatbots }) => {
  return (
    <div>
      {chatbots.map(chatbot => (
        <ChatbotCard key={chatbot.id} chatbot={chatbot} />
      ))}
    </div>
  );
});
```

## 🔒 Segurança

### Validações por Módulo

#### Auth Module
```typescript
export const loginSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});
```

#### Chatbots Module
```typescript
export const chatbotSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  vectorConfig: vectorConfigSchema.optional(),
});
```

#### Knowledge Module
```typescript
export const knowledgeBaseSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
});
```

## 🚀 Deploy

### Build Otimizado por Módulo

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          auth: ['./src/modules/auth'],
          chatbots: ['./src/modules/chatbots'],
          crawling: ['./src/modules/crawling'],
          knowledge: ['./src/modules/knowledge'],
          dashboard: ['./src/modules/dashboard'],
          userProfile: ['./src/modules/user-profile'],
        },
      },
    },
  },
});
```

## 📊 Monitoramento

### Métricas por Módulo

#### Auth Module
- Taxa de sucesso de login
- Tempo de resposta de autenticação
- Erros de validação

#### Chatbots Module
- Número de chatbots ativos
- Taxa de criação de chatbots
- Erros de configuração

#### Crawling Module
- Jobs em execução
- Taxa de sucesso de crawling
- Tempo médio de processamento

#### Knowledge Module
- Bases de conhecimento processadas
- Taxa de upload de arquivos
- Qualidade da extração

Esta estrutura modular garante que cada funcionalidade seja **independente**, **testável** e **escalável**, facilitando a manutenção e evolução do sistema. 