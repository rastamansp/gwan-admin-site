# Deploy GWAN Admin Site no Portainer

## 📋 Pré-requisitos

- Portainer configurado e funcionando
- Rede Docker `gwan` criada
- Traefik configurado com SSL
- Acesso ao repositório Git

## 🚀 Deploy via Portainer

### Opção 1: Deploy via Git (Recomendado)

#### 1. Criar Stack no Portainer

1. Acesse o Portainer
2. Vá em **Stacks** → **Add stack**
3. Configure:
   - **Name**: `gwan-admin-site`
   - **Build method**: `Repository`
   - **Repository URL**: `https://github.com/rastamansp/gwan-admin-site.git`
   - **Repository reference**: `main`
   - **Compose path**: `docker-compose.prod.yml`

#### 2. Configuração do Stack

```yaml
services:
  gwan-admin-site:
    build:
      context: git://github.com/rastamansp/gwan-admin-site.git#main
      dockerfile: Dockerfile
    container_name: gwan-admin-site
    environment:
      - VITE_API_URL=https://bff.gwan.com.br/api
      - VITE_APP_NAME=GWAN Admin
      - VITE_APP_VERSION=2.0.0
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.gwan-admin-site.rule=Host(`admin.gwan.com.br`)"
      - "traefik.http.routers.gwan-admin-site.entrypoints=websecure"
      - "traefik.http.routers.gwan-admin-site.tls.certresolver=letsencrypt"
      - "traefik.http.services.gwan-admin-site.loadbalancer.server.port=3000"
    restart: always
    networks:
      - gwan

networks:
  gwan:
    external: true
```

### Opção 2: Deploy Local (Alternativa)

Se houver problemas de conectividade com GitHub, use esta opção:

1. **Build method**: `Web editor`
2. Cole o conteúdo do `docker-compose.prod-local.yml`:

```yaml
services:
  gwan-admin-site:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: gwan-admin-site
    environment:
      - VITE_API_URL=https://bff.gwan.com.br/api
      - VITE_APP_NAME=GWAN Admin
      - VITE_APP_VERSION=2.0.0
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.gwan-admin-site.rule=Host(`admin.gwan.com.br`)"
      - "traefik.http.routers.gwan-admin-site.entrypoints=websecure"
      - "traefik.http.routers.gwan-admin-site.tls.certresolver=letsencrypt"
      - "traefik.http.services.gwan-admin-site.loadbalancer.server.port=3000"
    restart: always
    networks:
      - gwan

networks:
  gwan:
    external: true
```

3. **Upload files**: Faça upload dos arquivos do projeto (Dockerfile, package.json, src/, etc.)

### 3. Deploy

1. Clique em **Deploy the stack**
2. Aguarde o build e deploy
3. Verifique os logs se necessário

## 🔧 Configurações

### Variáveis de Ambiente

- `VITE_API_URL`: URL da API BFF (<https://bff.gwan.com.br/api>)
- `VITE_APP_NAME`: Nome da aplicação
- `VITE_APP_VERSION`: Versão da aplicação

### Traefik Labels

- **Host**: `admin.gwan.com.br`
- **SSL**: Automático via Let's Encrypt
- **Porta**: 3000

## 📊 Monitoramento

### Verificar Status

1. **Stacks** → `gwan-admin-site`
2. Verificar se o container está **Running**
3. Verificar logs se necessário

### Logs

```bash
# Via Portainer
Stacks → gwan-admin-site → Logs

# Via CLI
docker logs gwan-admin-site
```

## 🔄 Atualizações

### Deploy de Nova Versão

1. Faça push para o branch `main` no Git
2. No Portainer: **Stacks** → `gwan-admin-site` → **Update**
3. Aguarde o rebuild e redeploy

### Rollback

1. **Stacks** → `gwan-admin-site` → **Rollback**
2. Selecione a versão anterior

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Erro de Conectividade com GitHub

**Erro**: `fatal: unable to connect to github.com: Connection timed out`

**Soluções**:

- **Verificar conectividade**:

  ```bash
  ping github.com
  curl -I https://github.com
  ```

- **Configurar proxy** (se necessário):

  ```bash
  # No servidor
  export HTTP_PROXY=http://proxy:port
  export HTTPS_PROXY=http://proxy:port
  ```

- **Usar deploy local** (Opção 2 acima)
- **Verificar firewall/DNS**

#### 2. Build Falha

- Verificar logs do build
- Verificar se o Dockerfile está correto
- Verificar dependências no package.json

#### 3. Container Não Inicia

- Verificar variáveis de ambiente
- Verificar rede `gwan`
- Verificar conflitos de porta

#### 4. SSL Não Funciona

- Verificar configuração do Traefik
- Verificar DNS apontando para o servidor
- Verificar certificado Let's Encrypt

#### 5. CORS Errors

- Verificar se a API BFF aceita requisições do domínio
- Verificar configuração de CORS no backend

### Comandos Úteis

```bash
# Verificar conectividade
ping github.com
curl -I https://github.com

# Verificar container
docker ps | grep gwan-admin-site

# Verificar logs
docker logs gwan-admin-site

# Verificar rede
docker network ls | grep gwan

# Reiniciar container
docker restart gwan-admin-site

# Testar DNS
nslookup github.com
```

## 📝 Notas

- O build é feito diretamente do Git, então sempre use o branch `main`
- As variáveis de ambiente são processadas durante o build
- O container usa multi-stage build para otimização
- SSL é gerenciado automaticamente pelo Traefik
- Rede `gwan` deve existir antes do deploy
- Se houver problemas de conectividade, use a Opção 2 (deploy local)

## 🔗 Links Úteis

- **Aplicação**: <https://admin.gwan.com.br>
- **API BFF**: <https://bff.gwan.com.br/api>
- **Repositório**: <https://github.com/rastamansp/gwan-admin-site>
