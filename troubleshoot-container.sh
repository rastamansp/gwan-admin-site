#!/bin/bash

# Script de troubleshooting para o gwan-admin-site
# Diagnostica problemas comuns do container

CONTAINER_NAME="gwan-admin-site"
SITE_PATH="/opt/gwan-admin-site"

echo "🔍 Diagnóstico do Container gwan-admin-site"
echo "=========================================="

# 1. Verificar se o container existe
echo "1. Verificando se o container existe..."
if docker ps -a --filter "name=$CONTAINER_NAME" | grep -q "$CONTAINER_NAME"; then
    echo "✅ Container encontrado"
else
    echo "❌ Container não encontrado"
    exit 1
fi

# 2. Verificar status do container
echo -e "\n2. Status do container:"
docker ps -a --filter "name=$CONTAINER_NAME"

# 3. Verificar logs do container
echo -e "\n3. Últimos 20 logs do container:"
docker logs --tail 20 "$CONTAINER_NAME"

# 4. Verificar se o diretório dist existe
echo -e "\n4. Verificando build de produção..."
if [ -d "$SITE_PATH/dist" ]; then
    echo "✅ Diretório dist encontrado"
    echo "📁 Conteúdo do dist:"
    ls -la "$SITE_PATH/dist"
else
    echo "❌ Diretório dist não encontrado"
fi

# 5. Verificar se o arquivo index.html existe
echo -e "\n5. Verificando arquivo index.html..."
if [ -f "$SITE_PATH/dist/index.html" ]; then
    echo "✅ index.html encontrado"
else
    echo "❌ index.html não encontrado"
fi

# 6. Verificar se a porta 3000 está sendo usada
echo -e "\n6. Verificando porta 3000..."
if netstat -tuln | grep -q ":3000"; then
    echo "✅ Porta 3000 está em uso"
else
    echo "❌ Porta 3000 não está em uso"
fi

# 7. Testar conectividade interna do container
echo -e "\n7. Testando conectividade interna..."
if docker exec "$CONTAINER_NAME" curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Servidor responde internamente"
else
    echo "❌ Servidor não responde internamente"
fi

# 8. Verificar recursos do sistema
echo -e "\n8. Recursos do sistema:"
echo "💾 Memória disponível:"
free -h
echo -e "\n💿 Espaço em disco:"
df -h "$SITE_PATH"

# 9. Verificar rede Docker
echo -e "\n9. Verificando rede Docker..."
if docker network ls | grep -q "gwan"; then
    echo "✅ Rede 'gwan' encontrada"
else
    echo "❌ Rede 'gwan' não encontrada"
fi

# 10. Verificar Traefik
echo -e "\n10. Verificando Traefik..."
if docker ps | grep -q "traefik"; then
    echo "✅ Traefik está rodando"
else
    echo "❌ Traefik não está rodando"
fi

echo -e "\n🔧 Comandos úteis para troubleshooting:"
echo "• Ver logs em tempo real: docker logs -f $CONTAINER_NAME"
echo "• Entrar no container: docker exec -it $CONTAINER_NAME bash"
echo "• Reiniciar container: docker restart $CONTAINER_NAME"
echo "• Verificar health: docker inspect $CONTAINER_NAME | grep -A 10 Health"
echo "• Testar conectividade: curl -I http://localhost:3000" 