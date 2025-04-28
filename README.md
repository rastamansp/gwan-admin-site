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
git clone [url-do-repositorio]
cd gwan-admin-site
```

2. Instale as dependências:
```bash
npm install
```

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

## 🌐 Internacionalização

O projeto suporta múltiplos idiomas (PT-BR e EN) usando i18next. A mudança de idioma pode ser feita através do botão de idioma no cabeçalho.

## 🎨 Temas

O site suporta tema claro e escuro, com alternância automática baseada nas preferências do sistema e opção manual no cabeçalho.

## 🔐 Autenticação

O sistema inclui:
- Login/Logout
- Gerenciamento de perfil de usuário
- Controle de acesso baseado em permissões

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
- Porta do container: 80

### Volumes e Persistência

- A aplicação é stateless e não requer volumes persistentes
- Os assets são servidos através do Nginx em modo somente leitura
