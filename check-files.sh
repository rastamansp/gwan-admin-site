#!/bin/bash

# Script para verificar se todos os arquivos necessários existem
SITE_PATH="/opt/gwan-admin-site"

echo "🔍 Verificando arquivos necessários para o deploy..."

# Verifica se o diretório existe
if [ ! -d "$SITE_PATH" ]; then
    echo "❌ Diretório $SITE_PATH não encontrado!"
    exit 1
fi

cd "$SITE_PATH" || exit 1

echo "📁 Verificando arquivos no diretório: $SITE_PATH"
echo ""

# Lista todos os arquivos
echo "📋 Arquivos encontrados:"
ls -la

echo ""
echo "🔍 Verificações específicas:"

# Verifica docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml - OK"
else
    echo "❌ docker-compose.yml - NÃO ENCONTRADO"
fi

# Verifica nginx.conf
if [ -f "nginx.conf" ]; then
    echo "✅ nginx.conf - OK"
else
    echo "❌ nginx.conf - NÃO ENCONTRADO"
fi

# Verifica deploy-gwan-admin-site.sh
if [ -f "deploy-gwan-admin-site.sh" ]; then
    echo "✅ deploy-gwan-admin-site.sh - OK"
else
    echo "❌ deploy-gwan-admin-site.sh - NÃO ENCONTRADO"
fi

# Verifica build
if [ -d "build" ]; then
    echo "✅ build/ - OK"
    echo "   📁 Conteúdo do build:"
    ls -la build/ | head -10
else
    echo "❌ build/ - NÃO ENCONTRADO"
fi

# Verifica package.json
if [ -f "package.json" ]; then
    echo "✅ package.json - OK"
else
    echo "❌ package.json - NÃO ENCONTRADO"
fi

echo ""
echo "🌐 Verificando rede Docker:"
if docker network ls | grep -q "gwan"; then
    echo "✅ Rede gwan - OK"
else
    echo "❌ Rede gwan - NÃO ENCONTRADA"
    echo "   💡 Execute: docker network create gwan"
fi

echo ""
echo "📋 Próximos passos:"
echo "1. Se algum arquivo estiver faltando, execute: ./setup-first-deploy.sh"
echo "2. Se tudo estiver OK, suba o stack no Portainer"
echo "3. Após o deploy, execute: ./deploy-gwan-admin-site.sh" 