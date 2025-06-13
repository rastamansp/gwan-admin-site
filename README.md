# GWAN Admin Site

Sistema administrativo modular para gerenciamento de chatbots, crawling de dados e bases de conhecimento.

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **SOLID**, organizado em módulos independentes:

```
src/
├── modules/                   # Módulos da aplicação
│   ├── auth/                  # Autenticação e autorização
│   ├── chatbots/              # Gerenciamento de chatbots
│   ├── crawling/              # Crawling de dados web
│   ├── dashboard/             # Dashboard principal
│   ├── knowledge/             # Bases de conhecimento
│   └── user-profile/          # Perfil do usuário
├── services/                  # Serviços globais
├── components/                # Componentes compartilhados
├── hooks/                     # Hooks globais
├── types/                     # Tipos TypeScript globais
├── utils/                     # Utilitários
└── config/                    # Configurações
```

## 🚀 Tecnologias

- **React 19** com TypeScript
- **Vite** para build e desenvolvimento
- **TanStack Query** para gerenciamento de estado
- **React Router** para roteamento
- **Tailwind CSS** para estilização
- **React Hook Form** para formulários
- **React i18next** para internacionalização
- **Axios** para requisições HTTP

## 📦 Módulos

### 🔐 Auth Module
- **Páginas**: Login, Register, Verify, VerifyLogin
- **Componentes**: ProtectedRoute
- **Hooks**: useAuth
- **Serviços**: AuthService
- **Tipos**: UserSession, UpdateProfileData

### 🤖 Chatbots Module
- **Páginas**: ChatbotsPage, ChatbotList
- **Componentes**: ChatbotForm, ChatbotTable, VectorConfigForm, N8nConfigForm
- **Hooks**: useChatbotService
- **Serviços**: ChatbotService
- **Tipos**: Chatbot, CreateChatbotDto

### 🕷️ Crawling Module
- **Páginas**: CrawlingListPage, CrawlingDetailPage
- **Componentes**: CreateCrawlingModal, StatusBadge, FormatChips
- **Hooks**: useCrawling
- **Serviços**: CrawlingService
- **Tipos**: Crawling, CrawlingRequest, CrawlingStatus

### 📚 Knowledge Module
- **Páginas**: KnowledgeBaseManagement, KnowledgeBaseSearch, KnowledgeBaseDatasetUpload
- **Componentes**: KnowledgeBaseSidebar
- **Serviços**: KnowledgeService, DatasetService
- **Tipos**: KnowledgeBase, SimilarResult, DatasetFile

### 📊 Dashboard Module
- **Páginas**: Dashboard
- **Componentes**: Métricas e estatísticas

### 👤 User Profile Module
- **Páginas**: UserProfile
- **Funcionalidades**: Edição de perfil, atualização de dados

## 🛠️ Serviços Globais

### HttpService
Serviço centralizado para requisições HTTP com interceptors e tratamento de erros.

### SessionService
Gerenciamento de sessão do usuário com persistência local.

### LoggerService
Sistema de logs centralizado para monitoramento e debug.

## 🎯 Hooks Globais

### useAuth
Hook para autenticação e gerenciamento de usuário.

### useTheme
Hook para gerenciamento de tema (claro/escuro).

## 📋 Tipos Globais

### Errors
- `AuthError`: Erros de autenticação
- `NetworkError`: Erros de rede
- `ValidationError`: Erros de validação

## 🔧 Configuração

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=GWAN Admin
```

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificação de código
npm run preview      # Preview do build
```

## 🏛️ Princípios de Design

### Clean Architecture
- **Separação de responsabilidades** entre módulos
- **Inversão de dependência** com interfaces
- **Independência de frameworks** nos serviços

### SOLID
- **Single Responsibility**: Cada módulo tem uma responsabilidade
- **Open/Closed**: Extensível sem modificação
- **Liskov Substitution**: Interfaces bem definidas
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Dependências através de abstrações

## 🧹 Qualidade de Código

### Linting
- **ESLint** configurado com regras estritas
- **TypeScript** com configuração rigorosa
- **Prettier** para formatação consistente

### Padrões
- **Imports organizados** por tipo e ordem
- **Nomenclatura consistente** em todo o projeto
- **Tipos seguros** (evitando `any`)
- **Hooks otimizados** com `useCallback` e dependências corretas

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Estrutura de Build
```
dist/
├── assets/          # Assets otimizados
├── index.html       # Página principal
└── vite.svg         # Ícones
```

## 📈 Monitoramento

### Performance
- **Code splitting** automático por módulos
- **Lazy loading** de componentes pesados
- **Bundle analysis** disponível

### Debug
- **React Query DevTools** em desenvolvimento
- **Console logs** estruturados
- **Error boundaries** para captura de erros

## 🔄 Atualizações Recentes

### v2.0.0 - Modularização Completa
- ✅ **Refatoração modular** completa
- ✅ **Limpeza de código** (0 erros de lint)
- ✅ **Tipos seguros** (substituição de `any` por `unknown`)
- ✅ **Hooks otimizados** com `useCallback`
- ✅ **Imports organizados** e sem duplicações
- ✅ **Estrutura escalável** para novos módulos

### Melhorias Implementadas
- **Arquitetura modular** com separação clara de responsabilidades
- **Serviços centralizados** para funcionalidades compartilhadas
- **Tipos TypeScript** rigorosos e seguros
- **Performance otimizada** com hooks React corretos
- **Código limpo** sem variáveis ou imports não utilizados

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### Padrões de Commit
```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração de código
docs: documentação
test: testes
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔐 Fluxo de Autenticação

O sistema implementa um fluxo de autenticação seguro com as seguintes etapas:

1. **Registro**:
   - Usuário preenche nome, email e WhatsApp
   - Sistema verifica duplicidade de email/WhatsApp
   - Envia código de verificação via WhatsApp

2. **Verificação de Registro**:
   - Usuário insere código recebido
   - Sistema valida o código
   - Redireciona para login após verificação

3. **Login**:
   - Usuário insere email
   - Sistema envia código de verificação
   - Redireciona para página de verificação

4. **Verificação de Login**:
   - Usuário insere código recebido
   - Sistema valida o código
   - Gera token JWT para autenticação

5. **Proteção de Rotas**:
   - Rotas protegidas verificam token
   - Redireciona para login se não autenticado
   - Mantém URL original para redirecionamento após login

## 🌐 Internacionalização

O projeto suporta múltiplos idiomas (PT-BR e EN) usando i18next. A mudança de idioma pode ser feita através do botão de idioma no cabeçalho.

## 🎨 Temas

O site suporta tema claro e escuro, com alternância automática baseada nas preferências do sistema e opção manual no cabeçalho.

## 🐳 Docker

### Pré-requisitos
- Docker
- Docker Compose
- Traefik configurado na rede `traefik-public`

### Configuração com Docker

O projeto está configurado para rodar com Docker e Traefik, expondo a aplicação em HTTPS através do domínio `admin.gwan.com.br`.

1. Certifique-se de que o Traefik está configurado e rodando com:
   - Rede `traefik-public`
   - Endpoint `websecure` configurado
   - Certificados SSL via Let's Encrypt

2. Build e execução:
```bash
docker-compose up -d --build
```

3. Para parar a aplicação:
```bash
docker-compose down
```

### Configuração do Traefik

A aplicação está configurada para usar:
- HTTPS obrigatório
- Certificados automáticos via Let's Encrypt
- Domínio: admin.gwan.com.br
- Porta do container: 5173

## 📦 Procedimento de Deploy em Produção

### Pré-requisitos
- Acesso SSH ao servidor de produção
- Docker e Docker Compose instalados
- Traefik configurado com rede `gwan`
- Certificados SSL configurados

### Passos para Deploy

1. **Preparação do Ambiente**:
   ```bash
   # Acesse o servidor via SSH
   ssh usuario@servidor

   # Navegue até o diretório do projeto
   cd /opt/gwan-admin-site
   ```

2. **Atualização do Código**:
   ```bash
   # Atualize o código do repositório
   git pull origin main

   # Reconstrua a imagem e reinicie os containers
   docker-compose down
   docker-compose up -d --build
   ```

3. **Verificação**:
   - Acesse https://admin.gwan.com.br
   - Verifique os logs do container:
     ```bash
     docker-compose logs -f
     ```

### Configurações de Produção

- **Imagem:** node:20-bullseye
- **Container:** gwan-admin-site
- **Rede:** gwan (externa)
- **Volume:** /opt/gwan-admin-site:/app
- **Porta:** 5173
- **Domínio:** admin.gwan.com.br

### Notas Importantes
- O serviço é reiniciado automaticamente em caso de falha
- Usa Node.js 20 com Debian Bullseye
- Serve o build estático do site
- Protegido por TLS via Let's Encrypt
- Mantém logs para monitoramento

## 🛠 Desenvolvimento

### Padrões de Código

- Utilize TypeScript para todo novo código
- Siga as regras de linting configuradas
- Mantenha os componentes pequenos e focados
- Use os hooks personalizados para lógica reutilizável
- Mantenha a consistência com o design system existente

### Componentes

Os componentes seguem uma estrutura modular:
- `components/common/` - Componentes base reutilizáveis
- `components/layout/` - Componentes estruturais (Header, Sidebar)
- `components/modules/` - Componentes específicos de funcionalidades

## 🕷️ Crawling de Dados

O painel possui um módulo completo para gerenciamento de crawlings de dados, permitindo que o usuário crie, visualize e acompanhe requisições de extração de dados de URLs externas.

### Funcionalidades

- **Listagem de Crawlings:** Visualize todas as requisições de crawling realizadas, com status, formato e data.
- **Criação de Crawling:** Crie uma nova requisição informando a URL, formatos desejados (JSON, Markdown) e, opcionalmente, um JSON Schema.
- **Detalhe do Crawling:** Veja o resultado do crawling, incluindo o conteúdo extraído em Markdown e os metadados retornados pela API.
- **Paginação:** Navegue entre múltiplas páginas de resultados.
- **Tratamento de Erros e Estados:** Interface amigável para estados de carregamento, erro e vazio.

### Como Usar

1. **Acesse o menu "Crawling"** no painel lateral.
2. Clique em **"+ Novo Crawling"** para abrir o modal de criação.
3. Preencha a URL, selecione os formatos desejados e, se necessário, insira um JSON Schema.
4. Após criar, acompanhe o status na listagem.
5. Clique em qualquer item da lista para ver detalhes e o resultado do crawling.

### Observações Técnicas

- O gerenciamento de dados é feito com [TanStack Query (React Query)](https://tanstack.com/query/latest).
- O modal de criação utiliza [React Hook Form](https://react-hook-form.com/) e [Zod](https://zod.dev/) para validação.
- O campo de URL foi ajustado para garantir contraste e acessibilidade (`text-gray-900`).
- O sistema trata diferentes formatos de resposta da API para garantir robustez e compatibilidade.
