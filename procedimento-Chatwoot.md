# Procedimento de Criação de Super Admin no Chatwoot

## Contexto
O Chatwoot é uma plataforma de código aberto para atendimento ao cliente. Um Super Admin tem acesso total ao sistema, incluindo todas as contas e configurações.

## Pré-requisitos
1. Ter o Docker instalado e rodando
2. Ter o Chatwoot instalado e em execução
3. Ter acesso ao terminal com permissões de execução do Docker

## Passo a Passo

### 1. Acessar o Console Rails
```bash
# Acessar o container do Rails do Chatwoot
docker exec -it chatwoot-rails-1 sh

# Iniciar o console Rails
bundle exec rails console
```

### 2. Criar o Super Admin
```ruby
# Definir as credenciais
email = "admin@gwan.com.br"
password = "pazdeDeus@2025"
name = "Administrador Gwan"

# Criar o Super Admin
super_admin = SuperAdmin.new(
  email: email,
  password: password,
  name: name,
  confirmed_at: Time.now.utc  # Confirma o email automaticamente
)

# Salvar o Super Admin
super_admin.save!
```

## Verificações Importantes

### Após a Criação
1. Verificar se o usuário foi criado com sucesso:
```ruby
# No console Rails
SuperAdmin.find_by(email: "admin@gwan.com.br")
```

2. Verificar se o login está funcionando:
   - Acessar a interface web do Chatwoot
   - Tentar fazer login com as credenciais criadas
   - Confirmar que tem acesso a todas as funcionalidades de Super Admin

### Permissões do Super Admin
- Gerenciar todas as contas
- Criar novas contas
- Gerenciar usuários em todas as contas
- Acessar configurações globais
- Gerenciar integrações
- Acessar logs e relatórios do sistema

## Segurança

### Boas Práticas
1. Use uma senha forte (como a definida: "pazdeDeus@2025")
2. Mantenha as credenciais em local seguro
3. Não compartilhe as credenciais por canais não seguros
4. Considere habilitar autenticação de dois fatores após o primeiro login

### Em Caso de Problemas
1. Verificar logs do container:
```bash
docker logs chatwoot-rails-1
```

2. Verificar se o banco de dados está acessível:
```ruby
# No console Rails
ActiveRecord::Base.connection.active?
```

3. Verificar se há erros de validação:
```ruby
# No console Rails
super_admin.errors.full_messages
```

## Manutenção

### Alteração de Senha
```ruby
# No console Rails
super_admin = SuperAdmin.find_by(email: "admin@gwan.com.br")
super_admin.password = "nova_senha_segura"
super_admin.save!
```

### Desativação de Conta
```ruby
# No console Rails
super_admin = SuperAdmin.find_by(email: "admin@gwan.com.br")
super_admin.update!(active: false)
```

## Observações
1. O procedimento deve ser executado apenas por administradores do sistema
2. Mantenha um registro seguro das credenciais criadas
3. Considere criar um procedimento de backup antes de executar alterações no banco de dados
4. Em ambiente de produção, considere usar variáveis de ambiente para as credenciais

## Suporte
Em caso de problemas:
1. Verificar a documentação oficial do Chatwoot
2. Consultar os logs do sistema
3. Verificar o status dos containers Docker
4. Contatar a equipe de suporte do Gwan

Este procedimento é específico para a instalação do Chatwoot do Gwan e deve ser executado com cautela, especialmente em ambiente de produção.