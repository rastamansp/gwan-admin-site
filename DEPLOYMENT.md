# Guia de Deployment - GWAN Admin Site

## 🚀 Deploy Automatizado

### Script de Deploy
O projeto inclui um script automatizado de deploy: `deploy-gwan-admin-site.sh`

```bash
# Executar deploy
./deploy-gwan-admin-site.sh
```

### Docker Compose
Arquivo `docker-compose.yml` configurado com:
- Health check adequado
- Integração com Traefik
- Rede externa 'gwan'

## 🔧 Solução para Container "Unhealthy"

### Problema Identificado
O container está marcado como "unhealthy" mesmo com o servidor rodando na porta 3000.

### Soluções Implementadas

#### 1. Health Check Melhorado
```yaml
healthcheck:
  test: ["CMD", "bash", "/health-check.sh"]
  interval: 30s
  timeout: 15s
  retries: 3
  start_period: 60s
```

#### 2. Script de Health Check
Arquivo `health-check.sh` que verifica se o servidor responde corretamente.

#### 3. Container com curl
O container agora instala curl para permitir health checks HTTP.

### Passos para Resolver

#### Opção 1: Usar Docker Compose (Recomendado)
```bash
# 1. Copiar arquivos para o servidor
scp docker-compose.yml health-check.sh user@server:/opt/gwan-admin-site/

# 2. Executar deploy
cd /opt/gwan-admin-site
./deploy-gwan-admin-site.sh
```

#### Opção 2: Deploy Manual
```bash
# 1. Parar container atual
docker stop gwan-admin-site
docker rm gwan-admin-site

# 2. Executar deploy
./deploy-gwan-admin-site.sh

# 3. Verificar status
docker ps --filter "name=gwan-admin-site"
```

## 🔍 Troubleshooting

### Script de Diagnóstico
Execute o script de troubleshooting para diagnosticar problemas:

```bash
./troubleshoot-container.sh
```

### Verificações Manuais

#### 1. Verificar Status do Container
```bash
docker ps -a --filter "name=gwan-admin-site"
```

#### 2. Verificar Logs
```bash
docker logs -f gwan-admin-site
```

#### 3. Verificar Health Check
```bash
docker inspect gwan-admin-site | grep -A 10 Health
```

#### 4. Testar Conectividade
```bash
# Interna do container
docker exec gwan-admin-site curl -f http://localhost:3000

# Externa
curl -I http://localhost:3000
```

#### 5. Verificar Build
```bash
ls -la /opt/gwan-admin-site/dist/
```

### Problemas Comuns

#### Container não inicia
```bash
# Verificar logs
docker logs gwan-admin-site

# Verificar se o build existe
ls -la /opt/gwan-admin-site/dist/

# Reconstruir se necessário
cd /opt/gwan-admin-site
npm run build
```

#### Health check falha
```bash
# Verificar se o servidor está rodando
docker exec gwan-admin-site ps aux | grep serve

# Testar health check manualmente
docker exec gwan-admin-site bash /health-check.sh
```

#### Traefik não roteia
```bash
# Verificar se Traefik está rodando
docker ps | grep traefik

# Verificar labels do container
docker inspect gwan-admin-site | grep -A 20 Labels
```

## 📋 Checklist de Deploy

### Pré-deploy
- [ ] Código atualizado no repositório
- [ ] Build local funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Rede Docker 'gwan' criada

### Deploy
- [ ] Executar script de deploy
- [ ] Verificar logs do build
- [ ] Aguardar container ficar healthy
- [ ] Testar acesso via HTTPS

### Pós-deploy
- [ ] Verificar logs do container
- [ ] Testar funcionalidades principais
- [ ] Verificar métricas de performance
- [ ] Documentar mudanças

## 🛠️ Comandos Úteis

### Gerenciamento do Container
```bash
# Reiniciar container
docker restart gwan-admin-site

# Parar container
docker stop gwan-admin-site

# Remover container
docker rm gwan-admin-site

# Ver logs em tempo real
docker logs -f gwan-admin-site
```

### Debug
```bash
# Entrar no container
docker exec -it gwan-admin-site bash

# Verificar processos
docker exec gwan-admin-site ps aux

# Testar conectividade
docker exec gwan-admin-site curl -I http://localhost:3000
```

### Rede
```bash
# Verificar redes Docker
docker network ls

# Verificar conectividade da rede
docker network inspect gwan
```

## 📊 Monitoramento

### Logs
- Logs do deploy: `/opt/gwan-admin-site/deploy.log`
- Logs do container: `docker logs gwan-admin-site`
- Logs do Traefik: `docker logs traefik`

### Métricas
- Status do container: `docker ps`
- Uso de recursos: `docker stats gwan-admin-site`
- Health check: `docker inspect gwan-admin-site | grep Health`

## 🔒 Segurança

### Variáveis de Ambiente
- Manter `.env` seguro e não versionado
- Backup automático durante deploy
- Restauração em caso de falha

### Rede
- Container isolado na rede 'gwan'
- Traefik como proxy reverso
- HTTPS automático com Let's Encrypt

## 📞 Suporte

### Em caso de problemas:
1. Executar script de troubleshooting
2. Verificar logs do container
3. Verificar status do Traefik
4. Testar conectividade manualmente
5. Reverter para versão anterior se necessário

### Contatos
- Logs detalhados em `/opt/gwan-admin-site/deploy.log`
- Status do container via Portainer
- Métricas via Traefik Dashboard 