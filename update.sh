#!/bin/bash

# Script único para atualizar a aplicação
SITE_PATH="/opt/gwan-admin-site"

echo "🔄 Atualizando gwan-admin-site..."

cd "$SITE_PATH" || exit 1

# Atualiza o repositório
echo "📥 Atualizando repositório..."
git pull origin main

echo "✅ Atualização concluída!"
echo "💡 Agora faça rebuild do stack no Portainer" 