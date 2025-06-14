#!/bin/bash

# Script para configurar o primeiro deploy
SITE_PATH="/opt/gwan-admin-site"

echo "🔧 Configurando primeiro deploy do gwan-admin-site..."

# Verifica se o diretório existe
if [ ! -d "$SITE_PATH" ]; then
    echo "❌ Diretório $SITE_PATH não encontrado!"
    echo "📋 Execute primeiro: mkdir -p $SITE_PATH && cd $SITE_PATH && git clone <seu-repositorio> ."
    exit 1
fi

cd "$SITE_PATH" || exit 1

# Verifica se os arquivos necessários existem
echo "📋 Verificando arquivos necessários..."
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml não encontrado!"
    exit 1
fi

if [ ! -f "nginx.conf" ]; then
    echo "❌ nginx.conf não encontrado!"
    exit 1
fi

if [ ! -f "deploy-gwan-admin-site.sh" ]; then
    echo "❌ deploy-gwan-admin-site.sh não encontrado!"
    exit 1
fi

echo "✅ Todos os arquivos necessários encontrados!"

# Cria a rede gwan se não existir
echo "🌐 Verificando rede gwan..."
if ! docker network ls | grep -q "gwan"; then
    echo "🔧 Criando rede gwan..."
    docker network create gwan
    echo "✅ Rede gwan criada!"
else
    echo "✅ Rede gwan já existe!"
fi

# Verifica se o build existe
if [ ! -d "build" ]; then
    echo "🏗️ Build não encontrado. Executando build..."
    if ! npm install; then
        echo "❌ Falha ao instalar dependências!"
        exit 1
    fi
    
    if ! npm run build; then
        echo "❌ Falha ao gerar build!"
        exit 1
    fi
    echo "✅ Build gerado com sucesso!"
else
    echo "✅ Build já existe!"
fi

# Torna o script de deploy executável
chmod +x deploy-gwan-admin-site.sh

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse o Portainer"
echo "2. Vá para Stacks → Add stack"
echo "3. Configure:"
echo "   - Name: gwan-admin-site"
echo "   - Build method: Web editor"
echo "   - Cole o conteúdo do arquivo docker-compose.yml"
echo "4. Clique em 'Deploy the stack'"
echo ""
echo "🌐 Após o deploy, a aplicação estará disponível em: https://admin.gwan.com.br"
echo ""
echo "🔄 Para futuras atualizações, execute: ./deploy-gwan-admin-site.sh" 