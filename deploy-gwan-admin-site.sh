#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log com timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Função para log de erro
error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    exit 1
}

# Função para verificar se um comando foi executado com sucesso
check_status() {
    if [ $? -eq 0 ]; then
        log "$1"
    else
        error "$2"
    fi
}

echo "🚀 Iniciando processo de deploy do gwan-admin-site..."

SITE_PATH="/opt/gwan-admin-site"
BACKUP_DIR="/opt/backups/gwan-admin-site"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Verificar se o diretório existe
if [ ! -d "$SITE_PATH" ]; then
    error "Diretório $SITE_PATH não encontrado!"
fi

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Backup do build atual
if [ -d "$SITE_PATH/build" ]; then
    log "📦 Criando backup do build atual..."
    tar -czf "$BACKUP_DIR/build_$TIMESTAMP.tar.gz" -C "$SITE_PATH" build
    check_status "Backup criado com sucesso" "Falha ao criar backup"
fi

cd "$SITE_PATH" || error "Não foi possível acessar o diretório $SITE_PATH"

# Mostrar informações do projeto
if [ -f "package.json" ]; then
    VERSION=$(jq -r '.version' package.json)
    log "📦 Versão atual do package.json: v$VERSION"
fi

log "📜 Último commit:"
git --no-pager log -1 --pretty=format:"🔹 %h - %s (%cr) by %an"

# Backup das alterações locais
log "💾 Salvando alterações locais..."
git stash save "Auto-stash antes do deploy $TIMESTAMP" > /dev/null 2>&1
check_status "Alterações locais salvas" "Falha ao salvar alterações locais"

# Atualizar código
log "📥 Atualizando código..."
git pull
check_status "Código atualizado com sucesso" "Falha ao atualizar código"

# Instalar dependências
log "📦 Instalando dependências..."
npm install
check_status "Dependências instaladas com sucesso" "Falha ao instalar dependências"

# Build do projeto
log "⚙️ Gerando build de produção..."
npm run build
check_status "Build gerado com sucesso" "Falha ao gerar build"

# Verificar se o build foi gerado
if [ ! -d "build" ]; then
    error "Build não foi gerado corretamente!"
fi

# Reiniciar container
log "🐳 Reiniciando container Docker gwan-admin-site..."
docker restart gwan-admin-site
check_status "Container reiniciado com sucesso" "Falha ao reiniciar container"

# Verificar se o container está rodando
sleep 5
if ! docker ps | grep -q "gwan-admin-site"; then
    error "Container não está rodando após o restart!"
fi

# Limpar backups antigos (manter apenas os últimos 5)
log "🧹 Limpando backups antigos..."
ls -t "$BACKUP_DIR"/build_*.tar.gz | tail -n +6 | xargs -r rm
check_status "Backups antigos removidos" "Falha ao limpar backups antigos"

log "✅ Deploy finalizado com sucesso! Acesse: https://admin.gwan.com.br" 