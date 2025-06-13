# Guia de Desenvolvimento - GWAN Admin Site

## 🎯 Visão Geral

Este guia estabelece os padrões e boas práticas para desenvolvimento no GWAN Admin Site, garantindo consistência, qualidade e manutenibilidade do código.

## 🏗️ Arquitetura e Padrões

### Clean Architecture

Seguimos os princípios de Clean Architecture com 4 camadas bem definidas:

```
Presentation → Application → Domain ← Infrastructure
```

#### Regras de Dependência
- **Camadas internas** não conhecem camadas externas
- **Dependências** apontam sempre para dentro
- **Inversão de dependência** através de interfaces

### SOLID Principles

#### 1. Single Responsibility Principle (SRP)
Cada módulo e classe tem uma única responsabilidade.

```typescript
// ✅ Correto
export class AuthService {
  async login(email: string): Promise<void> {
    // Apenas lógica de login
  }
}

// ❌ Incorreto
export class AuthService {
  async login(email: string): Promise<void> {
    // Lógica de login + validação + logging + cache
  }
}
```

#### 2. Open/Closed Principle (OCP)
Extensível sem modificação.

```typescript
// ✅ Interface aberta para extensão
export interface IHttpService {
  get<T>(url: string): Promise<HttpResponse<T>>;
  post<T>(url: string, data?: unknown): Promise<HttpResponse<T>>;
}

// Implementações podem ser estendidas
export class AuthenticatedHttpService extends HttpService {
  // Extensão sem modificar a interface
}
```

#### 3. Liskov Substitution Principle (LSP)
Implementações são intercambiáveis.

```typescript
// ✅ Qualquer implementação pode ser usada
const authService: IAuthService = AuthService.getInstance();
// ou
const authService: IAuthService = MockAuthService.getInstance();
```

#### 4. Interface Segregation Principle (ISP)
Interfaces específicas para cada necessidade.

```typescript
// ✅ Interfaces específicas
export interface IAuthService {
  login(email: string): Promise<void>;
  logout(): Promise<void>;
}

export interface IProfileService {
  getProfile(): Promise<User>;
  updateProfile(data: UpdateProfileData): Promise<User>;
}
```

#### 5. Dependency Inversion Principle (DIP)
Dependências através de abstrações.

```typescript
// ✅ Hook depende de interface, não de implementação
export function useAuth() {
  const authService: IAuthService = AuthService.getInstance();
  // ...
}
```

## 📦 Estrutura de Módulos

### Padrão de Módulo

Cada módulo segue esta estrutura:

```
module-name/
├── pages/                  # Componentes de página
├── components/             # Componentes específicos
├── hooks/                  # Hooks customizados
├── services/               # Serviços de negócio
└── types/                  # Tipos TypeScript
```

### Convenções de Nomenclatura

#### Arquivos e Pastas
```typescript
// ✅ PascalCase para componentes
ChatbotForm.tsx
UserProfile.tsx

// ✅ camelCase para hooks e serviços
useAuth.ts
authService.ts

// ✅ kebab-case para pastas
user-profile/
knowledge-base/
```

#### Componentes
```typescript
// ✅ PascalCase para componentes
export const ChatbotList: React.FC<ChatbotListProps> = ({ chatbots }) => {
  return <div>{/* ... */}</div>;
};

// ✅ camelCase para props
interface ChatbotListProps {
  chatbots: Chatbot[];
  onSelect: (chatbot: Chatbot) => void;
}
```

#### Hooks
```typescript
// ✅ use + PascalCase
export function useAuth() {
  // ...
}

export function useChatbotService() {
  // ...
}
```

#### Serviços
```typescript
// ✅ PascalCase + Service
export class AuthService implements IAuthService {
  // ...
}

export class ChatbotService implements IChatbotService {
  // ...
}
```

## 🔧 Padrões de Código

### TypeScript

#### Tipos Seguros
```typescript
// ✅ Use unknown ao invés de any
export function parseResponse<T>(data: unknown): T {
  // Validação de tipo
  if (isValidResponse<T>(data)) {
    return data;
  }
  throw new Error('Invalid response format');
}

// ❌ Evite any
export function parseResponse(data: any): any {
  return data;
}
```

#### Interfaces vs Types
```typescript
// ✅ Use interfaces para objetos
export interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ Use types para unions e intersections
export type UserRole = 'admin' | 'user' | 'guest';
export type UserWithRole = User & { role: UserRole };
```

#### Generics
```typescript
// ✅ Use generics para reutilização
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export async function apiCall<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}
```

### React

#### Hooks
```typescript
// ✅ Use useCallback para funções passadas como props
export const ChatbotList: React.FC<ChatbotListProps> = ({ onSelect }) => {
  const handleSelect = useCallback((chatbot: Chatbot) => {
    onSelect(chatbot);
  }, [onSelect]);

  return (
    <div>
      {chatbots.map(chatbot => (
        <ChatbotCard 
          key={chatbot.id} 
          chatbot={chatbot} 
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

// ✅ Use useMemo para cálculos pesados
export const ChatbotStats: React.FC<{ chatbots: Chatbot[] }> = ({ chatbots }) => {
  const stats = useMemo(() => {
    return {
      total: chatbots.length,
      active: chatbots.filter(c => c.status === 'active').length,
      inactive: chatbots.filter(c => c.status === 'inactive').length,
    };
  }, [chatbots]);

  return <div>{/* ... */}</div>;
};
```

#### Dependências de useEffect
```typescript
// ✅ Sempre inclua todas as dependências
useEffect(() => {
  if (user && isAuthenticated) {
    loadUserData();
  }
}, [user, isAuthenticated, loadUserData]);

// ❌ Evite arrays vazios sem necessidade
useEffect(() => {
  loadInitialData();
}, []); // Só se realmente não depender de nada
```

#### Memoização
```typescript
// ✅ Use React.memo para componentes que recebem as mesmas props
export const ChatbotCard = React.memo<ChatbotCardProps>(({ chatbot, onSelect }) => {
  return (
    <div className="chatbot-card">
      <h3>{chatbot.name}</h3>
      <p>{chatbot.description}</p>
      <button onClick={() => onSelect(chatbot)}>
        Selecionar
      </button>
    </div>
  );
});
```

### CSS e Styling

#### Tailwind CSS
```typescript
// ✅ Use classes Tailwind consistentes
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};
```

#### Responsividade
```typescript
// ✅ Use breakpoints consistentes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id} item={item} />
  ))}
</div>
```

## 🧪 Testes

### Estrutura de Testes

```
tests/
├── unit/                   # Testes unitários
│   ├── services/           # Testes de serviços
│   ├── hooks/              # Testes de hooks
│   └── components/         # Testes de componentes
├── integration/            # Testes de integração
└── e2e/                    # Testes end-to-end
```

### Padrões de Teste

#### Testes Unitários
```typescript
// tests/unit/services/auth.service.test.ts
describe('AuthService', () => {
  let authService: AuthService;
  let mockHttpService: jest.Mocked<IHttpService>;

  beforeEach(() => {
    mockHttpService = createMockHttpService();
    authService = new AuthService(mockHttpService);
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const expectedResponse = { success: true, user: mockUser };
      mockHttpService.post.mockResolvedValue(expectedResponse);

      // Act
      const result = await authService.login(email);

      // Assert
      expect(mockHttpService.post).toHaveBeenCalledWith('/auth/login', { email });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw AuthError on invalid credentials', async () => {
      // Arrange
      const email = 'invalid@example.com';
      mockHttpService.post.mockRejectedValue(new AuthError('Invalid credentials'));

      // Act & Assert
      await expect(authService.login(email)).rejects.toThrow(AuthError);
    });
  });
});
```

#### Testes de Componentes
```typescript
// tests/unit/components/ChatbotList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatbotList } from '../../../src/modules/chatbots/components/ChatbotList';

describe('ChatbotList', () => {
  const mockChatbots = [
    { id: '1', name: 'Chatbot 1', status: 'active' },
    { id: '2', name: 'Chatbot 2', status: 'inactive' },
  ];

  it('should render list of chatbots', () => {
    render(<ChatbotList chatbots={mockChatbots} onSelect={jest.fn()} />);
    
    expect(screen.getByText('Chatbot 1')).toBeInTheDocument();
    expect(screen.getByText('Chatbot 2')).toBeInTheDocument();
  });

  it('should call onSelect when chatbot is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<ChatbotList chatbots={mockChatbots} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByText('Chatbot 1'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockChatbots[0]);
  });
});
```

#### Testes de Hooks
```typescript
// tests/unit/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../../src/modules/auth/hooks/useAuth';

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com');
    });

    expect(result.current.user).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## 🔒 Segurança

### Validação de Dados

```typescript
// ✅ Use Zod para validação
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
});

export type LoginData = z.infer<typeof loginSchema>;

// Uso
export function useLogin() {
  const handleLogin = async (data: unknown) => {
    try {
      const validatedData = loginSchema.parse(data);
      // Processar login
    } catch (error) {
      // Tratar erro de validação
    }
  };
}
```

### Sanitização

```typescript
// ✅ Sanitize inputs
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim());
}

// Uso
const userInput = '<script>alert("xss")</script>Hello';
const sanitized = sanitizeInput(userInput); // "Hello"
```

## 📊 Performance

### Otimizações

#### Code Splitting
```typescript
// ✅ Lazy loading de componentes
const ChatbotsPage = lazy(() => import('./modules/chatbots/pages/ChatbotsPage'));
const KnowledgePage = lazy(() => import('./modules/knowledge/pages/KnowledgePage'));

// Suspense para loading
<Suspense fallback={<LoadingSpinner />}>
  <ChatbotsPage />
</Suspense>
```

#### Caching
```typescript
// ✅ Cache inteligente com React Query
export const useChatbots = () => {
  return useQuery({
    queryKey: ['chatbots'],
    queryFn: () => chatbotService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};
```

#### Bundle Analysis
```bash
# Analisar tamanho do bundle
npm run build -- --analyze

# Verificar dependências
npm run deps:check
```

## 📝 Documentação

### Comentários

```typescript
// ✅ Documente funções complexas
/**
 * Calcula estatísticas dos chatbots
 * @param chatbots - Lista de chatbots
 * @returns Estatísticas calculadas
 */
export function calculateChatbotStats(chatbots: Chatbot[]): ChatbotStats {
  // Implementação
}

// ✅ Documente interfaces complexas
/**
 * Configuração de vetores para IA
 */
export interface VectorConfig {
  /** URL do serviço de vetores */
  serviceUrl: string;
  /** Chave de API */
  apiKey: string;
  /** Dimensão dos vetores */
  dimensions: number;
}
```

### JSDoc

```typescript
/**
 * Hook para gerenciamento de autenticação
 * @returns Objeto com estado e métodos de autenticação
 */
export function useAuth() {
  // ...
}

/**
 * Serviço para operações de autenticação
 */
export class AuthService {
  /**
   * Realiza login do usuário
   * @param email - Email do usuário
   * @param code - Código de verificação
   * @returns Promise com dados da sessão
   */
  async login(email: string, code: string): Promise<UserSession> {
    // ...
  }
}
```

## 🔄 Git e Versionamento

### Commits Semânticos

```bash
# ✅ Padrão: type(scope): description
feat(auth): add login with email verification
fix(chatbots): resolve infinite loop in chatbot list
refactor(services): extract common HTTP logic
docs(readme): update installation instructions
test(auth): add unit tests for AuthService
style(components): fix button alignment
perf(hooks): optimize useAuth with useCallback
ci(github): add automated testing workflow
chore(deps): update React to 19.0.0
```

### Branches

```bash
# ✅ Padrão de branches
main                    # Produção
develop                # Desenvolvimento
feature/auth-module    # Nova funcionalidade
bugfix/login-error     # Correção de bug
hotfix/security-patch  # Correção urgente
```

### Pull Requests

#### Template de PR
```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Testes
- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Testes manuais realizados

## Checklist
- [ ] Código segue padrões do projeto
- [ ] Documentação atualizada
- [ ] Commits semânticos
- [ ] Sem conflitos
```

## 🚀 Deploy

### Build de Produção

```bash
# Build otimizado
npm run build

# Preview local
npm run preview

# Análise de bundle
npm run build -- --analyze
```

### Variáveis de Ambiente

```bash
# .env.production
VITE_API_URL=https://api.gwan.com
VITE_APP_NAME=GWAN Admin
VITE_APP_VERSION=2.0.0
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## 🎯 Próximos Passos

### Melhorias Planejadas

1. **Testes E2E**: Implementar testes end-to-end com Playwright
2. **Storybook**: Documentação de componentes
3. **Performance**: Implementar métricas de performance
4. **Acessibilidade**: Audit completo de acessibilidade
5. **Internacionalização**: Suporte completo a i18n

### Monitoramento

1. **Error Tracking**: Implementar Sentry
2. **Analytics**: Google Analytics 4
3. **Performance**: Web Vitals
4. **Logs**: Estruturação de logs

Este guia garante que todos os desenvolvedores sigam os mesmos padrões, resultando em código consistente, manutenível e de alta qualidade. 