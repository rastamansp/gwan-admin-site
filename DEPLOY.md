# Deploy GWAN Admin Site

## 📋 Arquivos Necessários

- `docker-compose.yml` - Configuração do stack (produção via script)
- `docker-compose.portainer.yml` - Configuração para Portainer
- `docker-compose.local.yml` - Configuração para desenvolvimento local
- `Dockerfile` - Build da aplicação
- `nginx.conf` - Configuração do nginx
- `deploy.sh` - Script de deploy

## 🚀 Como Fazer Deploy

### 1. Produção - No Portainer (Recomendado)

**IMPORTANTE**: Primeiro você precisa fazer o build no servidor, depois subir no Portainer.

#### Passo 1: Build no Servidor

```bash
cd /opt/gwan-admin-site
./deploy.sh
```

#### Passo 2: Deploy no Portainer

1. Acesse o Portainer
2. Vá para **Stacks** → **Add stack**
3. Configure:
   - **Name**: `gwan-admin-site`
   - **Build method**: Web editor
   - **Cole o conteúdo do `docker-compose.portainer.yml`**
4. Clique em **Deploy the stack**

### 2. Produção - Via Script Completo (Alternativo)

```bash
cd /opt/gwan-admin-site
chmod +x deploy.sh
./deploy.sh
```

### 3. Desenvolvimento Local

```bash
# Build e execução local
docker-compose -f docker-compose.local.yml up -d --build

# Acesse: http://localhost:3000
```

## 🔧 Configurações

### Variáveis de Ambiente (Definidas nos docker-compose)

- `VITE_API_URL`: `https://bff.gwan.com.br/api`
- `VITE_APP_NAME`: `GWAN Admin`
- `VITE_APP_VERSION`: `2.0.0`
- `DOMAIN`: `admin.gwan.com.br` (produção)

### Rede Docker

A rede `gwan` será criada automaticamente se não existir (apenas produção).

## 🌐 Acesso

### Produção

- **URL**: <https://admin.gwan.com.br>
- **API**: <https://bff.gwan.com.br/api>

### Desenvolvimento Local

- **URL**: <http://localhost:3000>
- **API**: <https://bff.gwan.com.br/api>

## 🔄 Atualizações

### Produção

1. **Via Portainer**: Execute o build no servidor primeiro, depois reinicie o stack
2. **Via Script**: Execute `./deploy.sh` novamente

### Desenvolvimento Local

```bash
docker-compose -f docker-compose.local.yml up -d --build
```

## 📝 Logs

### Produção

```bash
docker logs gwan-admin-site
```

### Desenvolvimento Local

```bash
docker logs gwan-admin-site-local
```

## 💡 Diferenças entre os Docker-compose

- **`docker-compose.yml`**: Usado pelo script `deploy.sh` no servidor (faz build)
- **`docker-compose.portainer.yml`**: Usado no Portainer (usa build já feito)
- **`docker-compose.local.yml`**: Usado para desenvolvimento local (faz build)

## 🔄 Fluxo de Deploy no Portainer

1. **Build no servidor**: `./deploy.sh` (gera o build em `/opt/gwan-admin-site/build`)
2. **Deploy no Portainer**: Usa `docker-compose.portainer.yml` (monta o build já feito)
3. **Atualizações**: Repita o processo
