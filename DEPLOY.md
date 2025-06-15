# Deploy GWAN Admin Site

## 🚀 Fluxo Completo

### 1. Setup Inicial no Servidor

```bash
# Criar diretório e clonar repositório
mkdir -p /opt/gwan-admin-site
cd /opt/gwan-admin-site
git clone <seu-repositorio> .

# Criar rede Docker (se não existir)
docker network create gwan
```

### 2. Deploy no Portainer

1. Acesse o Portainer
2. Vá para **Stacks** → **Add stack**
3. Configure:
   - **Name**: `gwan-admin-site`
   - **Build method**: Web editor
   - **Cole o conteúdo do `docker-compose.portainer.yml`**
4. Clique em **Deploy the stack**

### 3. Desenvolvimento Local

```bash
# Build e execução local
docker-compose -f docker-compose.local.yml up -d --build

# Acesse: http://localhost:3000
```

## 🔄 Atualizações

### Produção

```bash
cd /opt/gwan-admin-site
chmod +x update.sh
./update.sh
```

Depois faça rebuild do stack no Portainer.

### Desenvolvimento Local

```bash
docker-compose -f docker-compose.local.yml up -d --build
```

## 🔧 Configurações

### Variáveis de Ambiente (Definidas no docker-compose.portainer.yml)

- `VITE_API_URL`: `https://bff.gwan.com.br/api`
- `VITE_APP_NAME`: `GWAN Admin`
- `VITE_APP_VERSION`: `2.0.0`

### Rede Docker

A rede `gwan` será criada automaticamente se não existir.

## 🌐 Acesso

### Produção

- **URL**: <https://admin.gwan.com.br>
- **API**: <https://bff.gwan.com.br/api>

### Desenvolvimento Local

- **URL**: <http://localhost:3000>
- **API**: <https://bff.gwan.com.br/api>

## 📝 Logs

### Produção

```bash
docker logs gwan-admin-site
```

### Desenvolvimento Local

```bash
docker logs gwan-admin-site-local
```

## 📋 Arquivos Necessários

- `docker-compose.portainer.yml` - Para produção (Portainer)
- `docker-compose.local.yml` - Para desenvolvimento local
- `Dockerfile` - Build da aplicação
- `nginx.conf` - Configuração do nginx
- `update.sh` - Script de atualização

## 💡 Fluxo de Trabalho

1. **Setup**: `git clone` no servidor
2. **Deploy**: Stack no Portainer
3. **Atualizações**: `./update.sh` + rebuild no Portainer
