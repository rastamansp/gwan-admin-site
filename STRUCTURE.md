# Estrutura do Projeto GWAN Admin Site

## 📁 Estrutura na VPS

```
/opt/gwan-admin-site/
├── build/                # Conteúdo gerado pelo "npm run build"
├── nginx.conf            # Config personalizado do NGINX
├── docker-compose.yml    # Stack para Portainer
├── deploy-gwan-admin-site.sh   # Script de deploy por Git + restart
└── deploy.log           # Logs do deploy
```

## 🚀 Como usar

### 1. Configuração Inicial

```bash
# Criar diretório na VPS
mkdir -p /opt/gwan-admin-site

# Clonar repositório
cd /opt/gwan-admin-site
git clone <seu-repositorio> .

# Tornar script executável
chmod +x deploy-gwan-admin-site.sh
```

### 2. Primeiro Deploy

```bash
# Executar script de deploy
./deploy-gwan-admin-site.sh
```

### 3. Configurar no Portainer

1. Acesse o Portainer
2. Vá para **Stacks** → **Add stack**
3. Use o arquivo `docker-compose.yml`
4. Deploy

### 4. Deploy Automático

Para atualizações futuras, basta executar:

```bash
./deploy-gwan-admin-site.sh
```

## 🔧 Configurações

### Variáveis de Ambiente

- `DOMAIN`: Domínio para o Traefik (padrão: `admin.gwan.com.br`)

### Rede Docker

Certifique-se de que a rede `gwan` existe:

```bash
docker network create gwan
```

## 💡 Vantagens desta Abordagem

- ✅ **Atualização sem rebuild**: Basta atualizar o repositório e reiniciar o container
- ✅ **Serviço leve**: nginx:alpine é rápido e estável
- ✅ **Compatível com Traefik**: Fácil mapeamento por subdomínio
- ✅ **Volumetria clara**: Você pode editar arquivos build diretamente no volume se necessário
- ✅ **Logs centralizados**: Todos os logs ficam em `/opt/gwan-admin-site/deploy.log`

## 🔍 Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker logs gwan-admin-site

# Verificar se a rede existe
docker network ls | grep gwan
```

### Build falha

```bash
# Verificar se o Node.js está instalado
node --version
npm --version

# Limpar cache do npm
npm cache clean --force
```

### Traefik não roteia

- Verifique se o domínio está apontando para o servidor
- Confirme se o Traefik está rodando
- Verifique os logs do Traefik
