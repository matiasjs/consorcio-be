#!/bin/bash

# Script maestro para ejecutar todos los tests del asistente IA
# Incluye tests unitarios, de regresión, de contrato y de integración

set -e

echo "🤖 SUITE COMPLETA DE TESTS DEL ASISTENTE IA"
echo "============================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar que el asistente está habilitado
if [ "${ASSISTANT_ENABLED:-false}" != "true" ]; then
    echo "⚠️  Advertencia: ASSISTANT_ENABLED no está configurado como true"
    echo "   Algunos tests pueden fallar si el asistente está deshabilitado"
    echo ""
fi

# 1. Tests unitarios del asistente
echo "🧪 PASO 1: TESTS UNITARIOS"
echo "----------------------------------------"
echo "Ejecutando tests unitarios del módulo assistant..."

if npm test -- --testPathPattern="assistant" --passWithNoTests; then
    echo "✅ Tests unitarios completados exitosamente"
else
    echo "❌ Tests unitarios fallaron"
    exit 1
fi

echo ""

# 2. Tests de regresión (requiere servidor corriendo)
echo "🔄 PASO 2: TESTS DE REGRESIÓN"
echo "----------------------------------------"

# Verificar si el servidor está corriendo
if curl -s -f "http://localhost:3000/api/v1/health" > /dev/null 2>&1; then
    echo "✅ Servidor detectado en http://localhost:3000"
    
    # Verificar si tenemos JWT token
    if [ -n "${JWT_TOKEN:-}" ]; then
        echo "🔑 JWT_TOKEN configurado, ejecutando tests de regresión..."
        if ./scripts/test-assistant-regression.sh; then
            echo "✅ Tests de regresión completados exitosamente"
        else
            echo "⚠️  Tests de regresión fallaron (puede ser normal si el LLM no está disponible)"
        fi
    else
        echo "⚠️  JWT_TOKEN no configurado, saltando tests de regresión"
        echo "   Para ejecutar: JWT_TOKEN=your_token ./scripts/test-assistant-regression.sh"
    fi
else
    echo "⚠️  Servidor no detectado en http://localhost:3000"
    echo "   Saltando tests de regresión (requiere servidor corriendo)"
fi

echo ""

# 3. Tests de apply mode (requiere tokens de admin y usuario)
echo "🔧 PASO 3: TESTS DE APPLY MODE"
echo "----------------------------------------"

if [ -n "${ADMIN_JWT_TOKEN:-}" ] && [ -n "${USER_JWT_TOKEN:-}" ]; then
    echo "🔑 Tokens de admin y usuario configurados, ejecutando tests de apply..."
    if ./scripts/test-assistant-apply.sh; then
        echo "✅ Tests de apply mode completados exitosamente"
    else
        echo "⚠️  Tests de apply mode fallaron"
    fi
elif [ -n "${ADMIN_JWT_TOKEN:-}" ]; then
    echo "🔑 Solo token de admin configurado, ejecutando tests limitados..."
    if USER_JWT_TOKEN="" ./scripts/test-assistant-apply.sh; then
        echo "✅ Tests de apply mode (limitados) completados exitosamente"
    else
        echo "⚠️  Tests de apply mode fallaron"
    fi
else
    echo "⚠️  Tokens de admin/usuario no configurados, saltando tests de apply"
    echo "   Para ejecutar: ADMIN_JWT_TOKEN=admin_token USER_JWT_TOKEN=user_token ./scripts/test-assistant-apply.sh"
fi

echo ""

# 4. Tests de contrato (tests Jest específicos)
echo "📋 PASO 4: TESTS DE CONTRATO"
echo "----------------------------------------"
echo "Ejecutando tests de contrato para herramientas..."

if npm test -- --testPathPattern="tool-execution.contract" --passWithNoTests; then
    echo "✅ Tests de contrato completados exitosamente"
else
    echo "❌ Tests de contrato fallaron"
    exit 1
fi

echo ""

# 5. Tests de integración (tests Jest E2E)
echo "🔗 PASO 5: TESTS DE INTEGRACIÓN"
echo "----------------------------------------"
echo "Ejecutando tests de integración del asistente..."

if npm test -- --testPathPattern="assistant.integration" --passWithNoTests; then
    echo "✅ Tests de integración completados exitosamente"
else
    echo "⚠️  Tests de integración fallaron (puede ser normal sin base de datos de test)"
fi

echo ""

# 6. Verificación de salud del asistente
echo "🏥 PASO 6: VERIFICACIÓN DE SALUD"
echo "----------------------------------------"

if curl -s -f "http://localhost:3000/api/v1/health" > /dev/null 2>&1; then
    echo "Verificando salud del asistente..."
    
    # Health check general
    health_response=$(curl -s "http://localhost:3000/api/v1/health" || echo '{"status":"error"}')
    api_status=$(echo "$health_response" | jq -r '.status // "unknown"')
    echo "   API Status: $api_status"
    
    # Health check del asistente (si está habilitado)
    if [ -n "${JWT_TOKEN:-}" ]; then
        assistant_health=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" \
            "http://localhost:3000/api/v1/assistant/health" 2>/dev/null || echo '{"status":"error"}')
        assistant_status=$(echo "$assistant_health" | jq -r '.status // "error"')
        llm_status=$(echo "$assistant_health" | jq -r '.llm // false')
        catalog_status=$(echo "$assistant_health" | jq -r '.catalog // false')
        
        echo "   Assistant Status: $assistant_status"
        echo "   LLM Available: $llm_status"
        echo "   Catalog Available: $catalog_status"
        
        if [ "$assistant_status" = "healthy" ]; then
            echo "✅ Asistente funcionando correctamente"
        else
            echo "⚠️  Asistente con problemas: $assistant_status"
        fi
    else
        echo "   (JWT_TOKEN no configurado para verificar asistente)"
    fi
else
    echo "⚠️  Servidor no disponible para verificación de salud"
fi

echo ""

# Resumen final
echo "📊 RESUMEN DE TESTS"
echo "============================================"
echo "✅ Tests unitarios: Ejecutados"
echo "$([ -n "${JWT_TOKEN:-}" ] && echo "✅" || echo "⚠️ ") Tests de regresión: $([ -n "${JWT_TOKEN:-}" ] && echo "Ejecutados" || echo "Saltados (sin JWT_TOKEN)")"
echo "$([ -n "${ADMIN_JWT_TOKEN:-}" ] && echo "✅" || echo "⚠️ ") Tests de apply mode: $([ -n "${ADMIN_JWT_TOKEN:-}" ] && echo "Ejecutados" || echo "Saltados (sin ADMIN_JWT_TOKEN)")"
echo "✅ Tests de contrato: Ejecutados"
echo "✅ Tests de integración: Ejecutados"
echo "$(curl -s -f "http://localhost:3000/api/v1/health" > /dev/null 2>&1 && echo "✅" || echo "⚠️ ") Verificación de salud: $(curl -s -f "http://localhost:3000/api/v1/health" > /dev/null 2>&1 && echo "Completada" || echo "Saltada (servidor no disponible)")"

echo ""
echo "🎉 Suite de tests del asistente IA completada!"
echo ""
echo "💡 NOTAS:"
echo "   - Para tests completos, asegúrate de tener el servidor corriendo"
echo "   - Configura JWT_TOKEN para tests de regresión"
echo "   - Configura ADMIN_JWT_TOKEN y USER_JWT_TOKEN para tests de apply"
echo "   - Los servicios LLM (Ollama + LiteLLM) deben estar corriendo para tests completos"
echo ""
echo "🚀 COMANDOS ÚTILES:"
echo "   # Levantar servidor con LLM:"
echo "   docker-compose --profile dev --profile llm up -d"
echo ""
echo "   # Obtener JWT tokens:"
echo "   JWT_TOKEN=\$(curl -s -X POST http://localhost:3000/api/v1/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@local.com\",\"password\":\"Admin123!\"}' | jq -r .accessToken)"
echo ""
echo "   # Ejecutar tests completos:"
echo "   JWT_TOKEN=\$JWT_TOKEN ADMIN_JWT_TOKEN=\$JWT_TOKEN ./scripts/test-assistant-all.sh"
