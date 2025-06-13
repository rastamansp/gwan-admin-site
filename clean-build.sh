#!/bin/bash

echo "🧹 Limpando cache e dependências..."
echo "=================================="

# Remove node_modules e package-lock.json
echo "🗑️ Removendo node_modules..."
rm -rf node_modules
rm -f package-lock.json

# Remove cache do Vite
echo "🗑️ Removendo cache do Vite..."
rm -rf .vite
rm -rf dist

# Remove cache do npm
echo "🗑️ Limpando cache do npm..."
npm cache clean --force

# Reinstala dependências
echo "📦 Reinstalando dependências..."
npm install

# Gera build de produção
echo "⚙️ Gerando build de produção..."
npm run build

echo "✅ Build limpo concluído!"
echo "📁 Verifique o diretório dist/" 