#!/bin/bash

# Configurações
SITE_PATH="/opt/gwan-admin-site"
ENV_FILE="$SITE_PATH/.env"
ENV_BACKUP="$SITE_PATH/.env.backup"
LOG_FILE="$SITE_PATH/deploy.log"

# Função para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Função para tratamento de erros
handle_error() {
    log "❌ ERRO: $1"
    # Restaura o .env se existir backup
    if [ -f "$ENV_BACKUP" ]; then
        log "🔄 Restaurando arquivo .env do backup..."
        cp "$ENV_BACKUP" "$ENV_FILE"
        rm "$ENV_BACKUP"
    fi
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

# Backup do .env
if [ -f "$ENV_FILE" ]; then
    log "📦 Fazendo backup do arquivo .env..."
    cp "$ENV_FILE" "$ENV_BACKUP" || handle_error "Falha ao fazer backup do .env"
fi

# Atualiza o código
log "📥 Atualizando código do repositório..."

# Reseta o .env para permitir o pull
if [ -f "$ENV_FILE" ]; then
    log "🔄 Temporariamente removendo .env para permitir atualização..."
    mv "$ENV_FILE" "${ENV_FILE}.temp"
fi

# Fetch e reset para o estado remoto
if ! git fetch origin; then
    if [ -f "${ENV_FILE}.temp" ]; then
        mv "${ENV_FILE}.temp" "$ENV_FILE"
    fi
    handle_error "Falha ao buscar atualizações do repositório"
fi

# Força o reset para o estado remoto
if ! git reset --hard origin/main; then
    if [ -f "${ENV_FILE}.temp" ]; then
        mv "${ENV_FILE}.temp" "$ENV_FILE"
    fi
    handle_error "Falha ao resetar para o estado remoto"
fi

# Limpa arquivos não rastreados
if ! git clean -fd; then
    log "⚠️ Aviso: Falha ao limpar arquivos não rastreados"
fi

# Restaura o .env do backup
if [ -f "$ENV_BACKUP" ]; then
    log "🔄 Restaurando arquivo .env..."
    cp "$ENV_BACKUP" "$ENV_FILE" || handle_error "Falha ao restaurar .env"
    rm "$ENV_BACKUP"
fi

# Remove arquivo temporário se existir
if [ -f "${ENV_FILE}.temp" ]; then
    rm "${ENV_FILE}.temp"
fi

# Instala dependências
log "📦 Instalando dependências..."
if ! npm install; then
    handle_error "Falha ao instalar dependências"
fi

# Atualiza npm se necessário
if [ "$(npm -v | cut -d. -f1)" -lt 11 ]; then
    log "📦 Atualizando npm..."
    npm install -g npm@latest || log "⚠️ Aviso: Falha ao atualizar npm"
fi

# Gera o build
log "⚙️ Gerando build de produção..."
if ! npm run build; then
    handle_error "Falha ao gerar build"
fi

# Reinicia o container
log "🐳 Reiniciando container Docker gwan-admin-site..."
if ! docker restart gwan-admin-site; then
    handle_error "Falha ao reiniciar container"
fi

log "✅ Deploy finalizado com sucesso!"
log "🌐 Acesse: https://admin.gwan.com.br"

# Limpa logs antigos (mantém apenas os últimos 10)
find "$SITE_PATH" -name "deploy.log.*" -type f -mtime +10 -delete

# Rotaciona o log atual se necessário
if [ -f "$LOG_FILE" ] && [ "$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE")" -gt 10485760 ]; then
    mv "$LOG_FILE" "$LOG_FILE.$(date +%Y%m%d%H%M%S)"
fi

exit 0