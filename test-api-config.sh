#!/bin/bash

# Script para testar a configuração da API
SITE_PATH="/opt/gwan-admin-site"

echo "🔍 Testando configuração da API..."

cd "$SITE_PATH" || exit 1

# Verifica se o build existe
if [ ! -d "build" ]; then
    echo "❌ Diretório build não encontrado!"
    echo "💡 Execute: ./deploy-gwan-admin-site.sh"
    exit 1
fi

# Procura por referências ao localhost no build
echo "🔍 Verificando referências ao localhost no build..."
if grep -r "localhost:3000" build/ > /dev/null 2>&1; then
    echo "❌ ENCONTRADAS referências ao localhost:3000 no build!"
    echo "📋 Arquivos com localhost:3000:"
    grep -r "localhost:3000" build/ | head -5
    echo ""
    echo "💡 Solução:"
    echo "1. Verifique se o arquivo env.production existe"
    echo "2. Execute: ./deploy-gwan-admin-site.sh"
    echo "3. Verifique se as variáveis de ambiente estão sendo definidas"
else
    echo "✅ Nenhuma referência ao localhost:3000 encontrada no build!"
fi

# Verifica se a API correta está sendo usada
echo ""
echo "🔍 Verificando se a API correta está sendo usada..."
if grep -r "bff.gwan.com.br" build/ > /dev/null 2>&1; then
    echo "✅ API correta (bff.gwan.com.br) encontrada no build!"
else
    echo "⚠️ API correta não encontrada no build"
fi

# Testa a conectividade com a API
echo ""
echo "🌐 Testando conectividade com a API..."
if curl -s -o /dev/null -w "%{http_code}" https://bff.gwan.com.br/api > /dev/null 2>&1; then
    echo "✅ API está acessível!"
else
    echo "❌ API não está acessível!"
    echo "💡 Verifique se o domínio bff.gwan.com.br está configurado corretamente"
fi

echo ""
echo "📋 Para corrigir o problema:"
echo "1. Execute: ./deploy-gwan-admin-site.sh"
echo "2. Verifique os logs para confirmar as variáveis de ambiente"
echo "3. Teste novamente: ./test-api-config.sh" 