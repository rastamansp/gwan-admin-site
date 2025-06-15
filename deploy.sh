#!/bin/bash

# Script único para deploy do gwan-admin-site
SITE_PATH="/opt/gwan-admin-site"

echo "🚀 Deploy do gwan-admin-site"

cd "$SITE_PATH" || exit 1

# Verifica se o diretório existe
if [ ! -d "$SITE_PATH" ]; then
    echo "❌ Diretório $SITE_PATH não encontrado!"
    exit 1
fi

# Verifica se os arquivos necessários existem
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml não encontrado!"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile não encontrado!"
    exit 1
fi

# Cria a rede gwan se não existir
echo "🌐 Verificando rede gwan..."
if ! docker network ls | grep -q "gwan"; then
    echo "🔧 Criando rede gwan..."
    docker network create gwan
fi

# Para e remove o container anterior
echo "🛑 Parando container anterior..."
docker-compose down

# Faz o build e sobe o container
echo "🏗️ Fazendo build e subindo container..."
docker-compose up -d --build

# Verifica se o container está rodando
echo "🏥 Verificando status do container..."
sleep 5
if docker ps --filter "name=gwan-admin-site" --filter "status=running" | grep -q "gwan-admin-site"; then
    echo "✅ Container está rodando!"
    echo "🌐 Acesse: https://admin.gwan.com.br"
else
    echo "❌ Container não está rodando!"
    echo "📋 Logs do container:"
    docker logs gwan-admin-site --tail 20
fi

echo "✅ Deploy concluído!" 