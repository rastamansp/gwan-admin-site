#!/bin/bash

# Caminho do volume no servidor
SITE_PATH="/opt/gwan-admin-site"

echo "🔄 Iniciando deploy do gwan-admin-site..."

# Garante que o diretório existe
if [ ! -d "$SITE_PATH" ]; then
  echo "❌ Diretório $SITE_PATH não encontrado!"
  exit 1
fi

cd "$SITE_PATH" || exit

# Atualiza o código
echo "📥 Dando git pull..."
git pull

# Instala dependências
echo "📦 Instalando dependências..."
npm install

# Gera o build
echo "⚙️ Gerando build de produção..."
npm run build

# Reinicia o container para servir o novo build
echo "🐳 Reiniciando container Docker gwan-admin-site..."
docker restart gwan-admin-site

echo "✅ Deploy finalizado! Acesse: https://admin.gwan.com.br"