#!/bin/bash

# Script de health check para o gwan-admin-site
# Verifica se o servidor está respondendo na porta 3000

HEALTH_URL="http://localhost:3000"
TIMEOUT=10
MAX_RETRIES=3

# Função para verificar se o servidor está respondendo
check_health() {
    local retries=0
    
    while [ $retries -lt $MAX_RETRIES ]; do
        # Tenta fazer uma requisição HTTP
        if curl -f -s --max-time $TIMEOUT "$HEALTH_URL" > /dev/null 2>&1; then
            echo "✅ Health check passed: Server is responding"
            exit 0
        fi
        
        retries=$((retries + 1))
        echo "⚠️ Health check attempt $retries failed, retrying in 5s..."
        sleep 5
    done
    
    echo "❌ Health check failed: Server is not responding after $MAX_RETRIES attempts"
    exit 1
}

# Executa o health check
check_health 