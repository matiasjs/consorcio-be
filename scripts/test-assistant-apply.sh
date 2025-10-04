#!/bin/bash

# Script para probar funcionalidad de apply del asistente con roles de admin
# Este script ejecuta operaciones reales en modo apply

set -e

API_BASE=${API_BASE:-"http://localhost:3000/api/v1"}
ADMIN_JWT_TOKEN=${ADMIN_JWT_TOKEN:-""}
USER_JWT_TOKEN=${USER_JWT_TOKEN:-""}

if [ -z "$ADMIN_JWT_TOKEN" ]; then
    echo "❌ Error: ADMIN_JWT_TOKEN no está configurado"
    echo "Uso: ADMIN_JWT_TOKEN=admin_token USER_JWT_TOKEN=user_token ./scripts/test-assistant-apply.sh"
    exit 1
fi

echo "🔧 Ejecutando tests de apply del asistente IA..."
echo "API Base: $API_BASE"
echo "=========================================="

# Función para generar clave de idempotencia única
generate_idempotency_key() {
    echo "test-$(date +%s)-$(shuf -i 1000-9999 -n 1)"
}

# Función para ejecutar herramienta
execute_tool() {
    local test_name="$1"
    local jwt_token="$2"
    local tool_type="$3"
    local entity="$4"
    local parameters="$5"
    local mode="$6"
    local should_succeed="$7"
    
    echo "🔧 Test: $test_name"
    echo "Modo: $mode, Usuario: $([ "$jwt_token" = "$ADMIN_JWT_TOKEN" ] && echo "ADMIN" || echo "USER")"
    
    idempotency_key=$(generate_idempotency_key)
    
    response=$(curl -s -X POST "$API_BASE/assistant/tool/execute" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $jwt_token" \
        -H "x-idempotency-key: $idempotency_key" \
        -d "{
            \"toolCall\": {
                \"type\": \"$tool_type\",
                \"parameters\": $parameters
            },
            \"mode\": \"$mode\"
        }")
    
    if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
        success=$(echo "$response" | jq -r '.success')
        if [ "$success" = "true" ] && [ "$should_succeed" = "true" ]; then
            echo "✅ PASS - Operación exitosa"
            affected=$(echo "$response" | jq -r '.explain.affectedRecords // 0')
            echo "   Registros afectados: $affected"
            if [ "$mode" = "apply" ]; then
                echo "   Datos: $(echo "$response" | jq -c '.data // {}')"
            fi
        elif [ "$success" = "false" ] && [ "$should_succeed" = "false" ]; then
            echo "✅ PASS - Falló como se esperaba"
            echo "   Error: $(echo "$response" | jq -r '.error')"
        else
            echo "❌ FAIL - Resultado inesperado"
            echo "   Esperado: $should_succeed, Obtenido: $success"
        fi
    else
        if [ "$should_succeed" = "false" ]; then
            echo "✅ PASS - Falló como se esperaba (HTTP error)"
        else
            echo "❌ FAIL - Error HTTP o respuesta inválida"
            echo "   Respuesta: $response"
        fi
    fi
    
    echo ""
}

# Test 1: Admin puede crear ticket en apply mode
echo "📝 TEST 1: ADMIN - Crear ticket (apply mode)"
echo "----------------------------------------"

execute_tool "Crear ticket como admin" \
    "$ADMIN_JWT_TOKEN" \
    "create" \
    "Ticket" \
    '{
        "entity": "Ticket",
        "data": {
            "title": "Test Ticket - Apply Mode",
            "description": "Ticket creado por test de apply mode",
            "priority": "medium",
            "status": "open"
        }
    }' \
    "apply" \
    "true"

# Test 2: Usuario regular NO puede crear ticket en apply mode
if [ -n "$USER_JWT_TOKEN" ]; then
    echo "📝 TEST 2: USER - Crear ticket (apply mode) - DEBE FALLAR"
    echo "----------------------------------------"
    
    execute_tool "Crear ticket como usuario regular" \
        "$USER_JWT_TOKEN" \
        "create" \
        "Ticket" \
        '{
            "entity": "Ticket",
            "data": {
                "title": "Test Ticket - Should Fail",
                "description": "Este ticket no debería crearse",
                "priority": "low",
                "status": "open"
            }
        }' \
        "apply" \
        "false"
fi

# Test 3: Admin puede buscar tickets (apply mode)
echo "📝 TEST 3: ADMIN - Buscar tickets (apply mode)"
echo "----------------------------------------"

execute_tool "Buscar tickets como admin" \
    "$ADMIN_JWT_TOKEN" \
    "find" \
    "Ticket" \
    '{
        "entity": "Ticket",
        "where": {"status": "open"},
        "limit": 5
    }' \
    "apply" \
    "true"

# Test 4: Admin puede actualizar ticket en apply mode
echo "📝 TEST 4: ADMIN - Actualizar ticket (apply mode)"
echo "----------------------------------------"

# Primero buscar un ticket para actualizar
search_response=$(curl -s -X POST "$API_BASE/assistant/tool/execute" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
    -H "x-idempotency-key: $(generate_idempotency_key)" \
    -d '{
        "toolCall": {
            "type": "find",
            "parameters": {
                "entity": "Ticket",
                "where": {"status": "open"},
                "limit": 1
            }
        },
        "mode": "apply"
    }')

if echo "$search_response" | jq -e '.data[0].id' > /dev/null 2>&1; then
    ticket_id=$(echo "$search_response" | jq -r '.data[0].id')
    
    execute_tool "Actualizar ticket como admin" \
        "$ADMIN_JWT_TOKEN" \
        "update" \
        "Ticket" \
        "{
            \"entity\": \"Ticket\",
            \"where\": {\"id\": \"$ticket_id\"},
            \"data\": {\"status\": \"in_progress\", \"priority\": \"high\"}
        }" \
        "apply" \
        "true"
else
    echo "⚠️  SKIP - No se encontraron tickets para actualizar"
    echo ""
fi

# Test 5: Usuario regular puede usar dry-run mode
if [ -n "$USER_JWT_TOKEN" ]; then
    echo "📝 TEST 5: USER - Buscar tickets (dry-run mode)"
    echo "----------------------------------------"
    
    execute_tool "Buscar tickets como usuario (dry-run)" \
        "$USER_JWT_TOKEN" \
        "find" \
        "Ticket" \
        '{
            "entity": "Ticket",
            "where": {"status": "open"},
            "limit": 3
        }' \
        "dry-run" \
        "true"
fi

# Test 6: Idempotencia - misma clave debe devolver mismo resultado
echo "📝 TEST 6: ADMIN - Test de idempotencia"
echo "----------------------------------------"

idempotency_key="test-idempotency-$(date +%s)"

echo "Primera ejecución con clave: $idempotency_key"
response1=$(curl -s -X POST "$API_BASE/assistant/tool/execute" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
    -H "x-idempotency-key: $idempotency_key" \
    -d '{
        "toolCall": {
            "type": "find",
            "parameters": {
                "entity": "Building",
                "where": {},
                "limit": 1
            }
        },
        "mode": "apply"
    }')

echo "Segunda ejecución con misma clave: $idempotency_key"
response2=$(curl -s -X POST "$API_BASE/assistant/tool/execute" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
    -H "x-idempotency-key: $idempotency_key" \
    -d '{
        "toolCall": {
            "type": "find",
            "parameters": {
                "entity": "Building",
                "where": {},
                "limit": 1
            }
        },
        "mode": "apply"
    }')

if [ "$(echo "$response1" | jq -r '.executedAt')" = "$(echo "$response2" | jq -r '.executedAt')" ]; then
    echo "✅ PASS - Idempotencia funcionando correctamente"
    echo "   Timestamp: $(echo "$response1" | jq -r '.executedAt')"
else
    echo "❌ FAIL - Idempotencia no funciona"
    echo "   Timestamp 1: $(echo "$response1" | jq -r '.executedAt')"
    echo "   Timestamp 2: $(echo "$response2" | jq -r '.executedAt')"
fi

echo ""

# Test 7: Crear y luego buscar el registro creado
echo "📝 TEST 7: ADMIN - Crear y verificar registro"
echo "----------------------------------------"

# Crear un edificio de prueba
create_response=$(curl -s -X POST "$API_BASE/assistant/tool/execute" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
    -H "x-idempotency-key: $(generate_idempotency_key)" \
    -d '{
        "toolCall": {
            "type": "create",
            "parameters": {
                "entity": "Building",
                "data": {
                    "name": "Edificio Test Apply",
                    "address": "Calle Test 123",
                    "floors": 5,
                    "units": 20
                }
            }
        },
        "mode": "apply"
    }')

if echo "$create_response" | jq -e '.success' > /dev/null 2>&1 && [ "$(echo "$create_response" | jq -r '.success')" = "true" ]; then
    building_id=$(echo "$create_response" | jq -r '.data.id')
    echo "✅ Edificio creado con ID: $building_id"
    
    # Buscar el edificio creado
    find_response=$(curl -s -X POST "$API_BASE/assistant/tool/execute" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ADMIN_JWT_TOKEN" \
        -H "x-idempotency-key: $(generate_idempotency_key)" \
        -d "{
            \"toolCall\": {
                \"type\": \"find\",
                \"parameters\": {
                    \"entity\": \"Building\",
                    \"where\": {\"id\": \"$building_id\"}
                }
            },
            \"mode\": \"apply\"
        }")
    
    if echo "$find_response" | jq -e '.data[0].id' > /dev/null 2>&1; then
        found_id=$(echo "$find_response" | jq -r '.data[0].id')
        if [ "$found_id" = "$building_id" ]; then
            echo "✅ PASS - Edificio encontrado correctamente"
        else
            echo "❌ FAIL - ID no coincide: esperado $building_id, encontrado $found_id"
        fi
    else
        echo "❌ FAIL - No se pudo encontrar el edificio creado"
    fi
else
    echo "❌ FAIL - No se pudo crear el edificio"
fi

echo ""
echo "🎉 Tests de apply mode completados!"
echo "=========================================="
