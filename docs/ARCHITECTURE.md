# Arquitetura do GWAN Admin Site

## 🏗️ Visão Geral

O GWAN Admin Site segue os princípios de **Clean Architecture** e **SOLID**, implementando uma arquitetura modular que promove:

- **Separação de responsabilidades**
- **Baixo acoplamento**
- **Alta coesão**
- **Testabilidade**
- **Escalabilidade**

## 📦 Estrutura Modular

### Módulos Principais

```
src/modules/
├── auth/                   # 🔐 Autenticação e Autorização
├── chatbots/               # 🤖 Gerenciamento de Chatbots
├── crawling/               # 🕷️ Crawling de Dados
├── dashboard/              # 📊 Dashboard Principal
├── knowledge/              # 📚 Bases de Conhecimento
└── user-profile/           # 👤 Perfil do Usuário
```

### Estrutura Interna de Cada Módulo

Cada módulo segue uma estrutura padronizada:

```
module-name/
├── pages/                  # Componentes de página
├── components/             # Componentes específicos do módulo
├── hooks/                  # Hooks customizados
├── services/               # Serviços de negócio
└── types/                  # Tipos TypeScript
```

## 🔧 Camadas da Arquitetura

### 1. Camada de Apresentação (Presentation Layer)

**Responsabilidade**: Interface do usuário e interações

**Componentes**:
- `pages/` - Páginas principais
- `components/` - Componentes reutilizáveis
- `hooks/` - Hooks React customizados

**Características**:
- Não contém lógica de negócio
- Comunica apenas com a camada de aplicação
- Responsável por renderização e eventos

### 2. Camada de Aplicação (Application Layer)

**Responsabilidade**: Orquestração de casos de uso

**Componentes**:
- `services/` - Serviços de aplicação
- `hooks/` - Hooks que orquestram operações

**Características**:
- Coordena fluxos de negócio
- Gerencia estado da aplicação
- Implementa casos de uso

### 3. Camada de Domínio (Domain Layer)

**Responsabilidade**: Regras de negócio e entidades

**Componentes**:
- `types/` - Entidades e tipos de domínio
- Interfaces de serviços

**Características**:
- Contém regras de negócio
- Independente de frameworks
- Define contratos (interfaces)

### 4. Camada de Infraestrutura (Infrastructure Layer)

**Responsabilidade**: Acesso a dados e serviços externos

**Componentes**:
- `services/` - Implementações concretas
- `utils/` - Utilitários de infraestrutura

**Características**:
- Implementa interfaces do domínio
- Gerencia comunicação externa
- Lida com persistência

## 🎯 Princípios de Design

### Clean Architecture

#### Regra de Dependência
```
Presentation → Application → Domain ← Infrastructure
```

- **Camadas internas** não conhecem camadas externas
- **Dependências** apontam sempre para dentro
- **Inversão de dependência** através de interfaces

#### Exemplo de Implementação

```typescript
// Domain Layer (types/auth.types.ts)
export interface IAuthService {
  login(email: string): Promise<void>;
  verifyLogin(email: string, code: string): Promise<UserSession>;
}

// Infrastructure Layer (services/auth.service.ts)
export class AuthService implements IAuthService {
  // Implementação concreta
}

// Application Layer (hooks/useAuth.ts)
export function useAuth() {
  const authService: IAuthService = AuthService.getInstance();
  // Lógica de aplicação
}
```

### SOLID Principles

#### 1. Single Responsibility Principle (SRP)
Cada módulo tem uma única responsabilidade:

- **Auth Module**: Autenticação e autorização
- **Chatbots Module**: Gerenciamento de chatbots
- **Knowledge Module**: Bases de conhecimento

#### 2. Open/Closed Principle (OCP)
Extensível sem modificação:

```typescript
// Interface aberta para extensão
export interface IHttpService {
  get<T>(url: string): Promise<HttpResponse<T>>;
  post<T>(url: string, data?: unknown): Promise<HttpResponse<T>>;
}

// Implementações podem ser estendidas sem modificar a interface
export class HttpService implements IHttpService {
  // Implementação base
}

export class AuthenticatedHttpService extends HttpService {
  // Extensão com autenticação
}
```

#### 3. Liskov Substitution Principle (LSP)
Implementações são intercambiáveis:

```typescript
// Qualquer implementação de IAuthService pode ser usada
const authService: IAuthService = AuthService.getInstance();
// ou
const authService: IAuthService = MockAuthService.getInstance();
```

#### 4. Interface Segregation Principle (ISP)
Interfaces específicas para cada necessidade:

```typescript
// Interface específica para autenticação
export interface IAuthService {
  login(email: string): Promise<void>;
  logout(): Promise<void>;
}

// Interface específica para perfil
export interface IProfileService {
  getProfile(): Promise<User>;
  updateProfile(data: UpdateProfileData): Promise<User>;
}
```

#### 5. Dependency Inversion Principle (DIP)
Dependências através de abstrações:

```typescript
// Hook depende de interface, não de implementação
export function useAuth() {
  const authService: IAuthService = AuthService.getInstance();
  // ...
}
```

## 🔄 Padrões de Comunicação

### 1. Comunicação Entre Módulos

```typescript
// Módulo A usa serviço do Módulo B através de interface
import { IAuthService } from '../auth/types/auth.types';

export class ChatbotService {
  constructor(private authService: IAuthService) {}
  
  async createChatbot(data: CreateChatbotDto) {
    // Usa autenticação sem conhecer implementação
    const user = await this.authService.getCurrentUser();
    // ...
  }
}
```

### 2. Injeção de Dependência

```typescript
// Serviços são injetados via construtor ou factory
export class ServiceFactory {
  static createAuthService(): IAuthService {
    return AuthService.getInstance();
  }
  
  static createHttpService(): IHttpService {
    return HttpService.getInstance();
  }
}
```

### 3. Event-Driven Communication

```typescript
// Eventos para comunicação desacoplada
export const AUTH_EVENTS = {
  USER_LOGGED_IN: 'user:logged-in',
  USER_LOGGED_OUT: 'user:logged-out',
} as const;

// Publisher
eventBus.emit(AUTH_EVENTS.USER_LOGGED_IN, user);

// Subscriber
eventBus.on(AUTH_EVENTS.USER_LOGGED_IN, (user) => {
  // Atualizar estado global
});
```

## 🧪 Testabilidade

### Estrutura de Testes

```
tests/
├── unit/                   # Testes unitários
│   ├── services/           # Testes de serviços
│   ├── hooks/              # Testes de hooks
│   └── utils/              # Testes de utilitários
├── integration/            # Testes de integração
└── e2e/                    # Testes end-to-end
```

### Exemplo de Teste Unitário

```typescript
// tests/unit/services/auth.service.test.ts
describe('AuthService', () => {
  let authService: IAuthService;
  let mockHttpService: jest.Mocked<IHttpService>;

  beforeEach(() => {
    mockHttpService = createMockHttpService();
    authService = new AuthService(mockHttpService);
  });

  it('should login successfully', async () => {
    // Arrange
    const email = 'test@example.com';
    mockHttpService.post.mockResolvedValue({ data: { success: true } });

    // Act
    await authService.login(email);

    // Assert
    expect(mockHttpService.post).toHaveBeenCalledWith('/auth/login', { email });
  });
});
```

## 📊 Monitoramento e Observabilidade

### Logging Estruturado

```typescript
// services/logger.service.ts
export class LoggerService {
  info(message: string, context?: Record<string, unknown>) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context,
    }));
  }
}
```

### Métricas de Performance

```typescript
// hooks/usePerformance.ts
export function usePerformance() {
  const measureTime = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    console.log(`Performance [${name}]: ${end - start}ms`);
  }, []);

  return { measureTime };
}
```

## 🔒 Segurança

### Validação de Dados

```typescript
// types/validation.ts
export const loginSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export type LoginData = z.infer<typeof loginSchema>;
```

### Sanitização

```typescript
// utils/sanitize.ts
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim());
}
```

## 🚀 Deploy e CI/CD

### Build Otimizado

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
        },
      },
    },
  },
});
```

### Análise de Bundle

```bash
# Analisar tamanho do bundle
npm run build -- --analyze

# Verificar dependências
npm run deps:check
```

## 📈 Escalabilidade

### Estratégias de Escalabilidade

1. **Code Splitting**: Carregamento sob demanda
2. **Lazy Loading**: Componentes carregados quando necessário
3. **Caching**: Cache inteligente com React Query
4. **Optimistic Updates**: Atualizações otimistas para UX

### Exemplo de Code Splitting

```typescript
// Lazy loading de módulos
const ChatbotsPage = lazy(() => import('./modules/chatbots/pages/ChatbotsPage'));
const KnowledgePage = lazy(() => import('./modules/knowledge/pages/KnowledgePage'));

// Suspense para loading
<Suspense fallback={<LoadingSpinner />}>
  <ChatbotsPage />
</Suspense>
```

## 🔄 Versionamento

### Estratégia de Versionamento

- **Semantic Versioning** (MAJOR.MINOR.PATCH)
- **Changelog** detalhado
- **Breaking Changes** documentados
- **Migration Guides** para versões major

### Exemplo de Changelog

```markdown
# Changelog

## [2.0.0] - 2024-01-15
### Added
- Arquitetura modular completa
- Tipos TypeScript seguros
- Hooks otimizados

### Changed
- Refatoração completa da estrutura
- Substituição de `any` por `unknown`

### Removed
- Imports não utilizados
- Variáveis não utilizadas
```

Esta arquitetura garante que o projeto seja **manutenível**, **escalável** e **testável**, seguindo as melhores práticas de desenvolvimento de software. 