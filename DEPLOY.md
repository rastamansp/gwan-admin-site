# Deploy GWAN Admin Site

## 📋 Arquivos Necessários

- `docker-compose.yml` - Configuração do stack
- `Dockerfile` - Build da aplicação
- `nginx.conf` - Configuração do nginx
- `deploy.sh` - Script de deploy

## 🚀 Como Fazer Deploy

### 1. No Portainer (Recomendado)

1. Acesse o Portainer
2. Vá para **Stacks** → **Add stack**
3. Configure:
   - **Name**: `gwan-admin-site`
   - **Build method**: Web editor
   - **Cole o conteúdo do `docker-compose.yml`**
4. Clique em **Deploy the stack**

### 2. Via Script (Alternativo)

```bash
cd /opt/gwan-admin-site
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Configurações

### Variáveis de Ambiente (Definidas no docker-compose.yml)

- `VITE_API_URL`: `https://bff.gwan.com.br/api`
- `VITE_APP_NAME`: `GWAN Admin`
- `VITE_APP_VERSION`: `2.0.0`
- `DOMAIN`: `admin.gwan.com.br` (padrão)

### Rede Docker

A rede `gwan` será criada automaticamente se não existir.

## 🌐 Acesso

Após o deploy, a aplicação estará disponível em:

- **URL**: <https://admin.gwan.com.br>
- **API**: <https://bff.gwan.com.br/api>

## 🔄 Atualizações

Para atualizar a aplicação:

1. **Via Portainer**: Rebuild do stack
2. **Via Script**: Execute `./deploy.sh` novamente

## 📝 Logs

Para ver os logs:

```bash
docker logs gwan-admin-site
```
