#!/bin/bash

# Configurações
SITE_PATH="/opt/gwan-admin-site"
LOG_FILE="$SITE_PATH/deploy.log"

# Função para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Função para tratamento de erros
handle_error() {
    log "❌ ERRO: $1"
    exit 1
}

# Inicializa o arquivo de log
echo "=== Início do deploy em $(date) ===" > "$LOG_FILE"

log "🔄 Iniciando deploy do gwan-admin-site..."

# Verifica se o diretório existe
if [ ! -d "$SITE_PATH" ]; then
    handle_error "Diretório $SITE_PATH não encontrado!"
fi

cd "$SITE_PATH" || handle_error "Não foi possível acessar o diretório $SITE_PATH"

# Atualiza o repositório
log "📥 Atualizando repositório..."
if ! git pull origin main; then
    handle_error "Falha ao atualizar repositório"
fi

# Instala dependências
log "📦 Instalando dependências..."
if ! npm install; then
    handle_error "Falha ao instalar dependências"
fi

# Gera o build
log "🏗️ Buildando o projeto Vite..."
if ! npm run build; then
    handle_error "Falha ao gerar build"
fi

# Verifica se o build foi gerado
if [ ! -d "build" ]; then
    handle_error "Diretório build não foi criado após o build"
fi

# Reinicia o container
log "♻️ Reiniciando container no Portainer..."
if ! docker restart gwan-admin-site; then
    log "⚠️ Aviso: Falha ao reiniciar container. Verifique se está rodando no Portainer."
else
    log "✅ Container reiniciado com sucesso!"
fi

# Verifica se o container está rodando
log "🏥 Verificando status do container..."
sleep 5
if docker ps --filter "name=gwan-admin-site" --filter "status=running" | grep -q "gwan-admin-site"; then
    log "✅ Container está rodando!"
    log "🌐 Acesse: https://admin.gwan.com.br"
else
    log "⚠️ Container não está rodando. Verifique os logs no Portainer."
fi

log "✅ Deploy finalizado!"

# Limpa logs antigos (mantém apenas os últimos 10)
find "$SITE_PATH" -name "deploy.log.*" -type f -mtime +10 -delete

# Rotaciona o log atual se necessário
if [ -f "$LOG_FILE" ] && [ "$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE")" -gt 10485760 ]; then
    mv "$LOG_FILE" "$LOG_FILE.$(date +%Y%m%d%H%M%S)"
fi

exit 0 