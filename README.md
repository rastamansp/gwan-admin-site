# GWAN Admin Site

Um painel administrativo moderno construído com React, Vite, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

Este projeto utiliza as seguintes tecnologias:

- [React](https://react.dev/) - Biblioteca JavaScript para construção de interfaces
- [Vite](https://vitejs.dev/) - Build tool e dev server
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [React Query](https://tanstack.com/query/latest) - Gerenciamento de estado e cache para dados do servidor
- [React Router](https://reactrouter.com/) - Roteamento para React
- [i18next](https://www.i18next.com/) - Internacionalização
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [Zod](https://zod.dev/) - Validação de esquemas TypeScript
- [Headless UI](https://headlessui.com/) - Componentes UI acessíveis e sem estilo
- [Heroicons](https://heroicons.com/) - Ícones SVG

## 📁 Estrutura do Projeto

```
src/
├── assets/      # Arquivos estáticos (imagens, etc)
├── components/  # Componentes React reutilizáveis
│   ├── common/  # Componentes comuns
│   ├── layout/  # Componentes de layout (Header, Sidebar, etc)
│   └── modules/ # Componentes específicos de módulos
├── config/      # Configurações do projeto
├── hooks/       # Custom React hooks
├── i18n/        # Configurações e arquivos de internacionalização
├── pages/       # Componentes de página
├── services/    # Serviços e integrações com APIs
├── types/       # Definições de tipos TypeScript
└── utils/       # Funções utilitárias
```

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/rastamansp/gwan-admin-site.git
cd gwan-admin-site
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

## 🌍 Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

```env
VITE_API_URL=http://localhost:3000  # URL da API backend
```

Você pode criar diferentes arquivos para diferentes ambientes:
- `.env.development` - Desenvolvimento local
- `.env.production` - Produção
- `.env.staging` - Ambiente de staging

## 🚀 Executando o Projeto

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

O site estará disponível em `http://localhost:5173` (ou próxima porta disponível).

Outros comandos disponíveis:
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção localmente
- `npm run lint` - Executa verificação de linting

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

## 📝 Licença

Este projeto está sob a licença [inserir tipo de licença].

## 👥 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
