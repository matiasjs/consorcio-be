#!/bin/bash

# Script para ejecutar tests de regresión del asistente IA
# Este script ejecuta una serie de prompts de prueba contra el asistente

set -e

API_BASE=${API_BASE:-"http://localhost:3000/api/v1"}
JWT_TOKEN=${JWT_TOKEN:-""}

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ Error: JWT_TOKEN no está configurado"
    echo "Uso: JWT_TOKEN=your_token ./scripts/test-assistant-regression.sh"
    exit 1
fi

echo "🤖 Ejecutando tests de regresión del asistente IA..."
echo "API Base: $API_BASE"
echo "=========================================="

# Función para ejecutar un test
run_test() {
    local test_name="$1"
    local message="$2"
    local expected_tool="$3"
    local expected_entity="$4"
    
    echo "📝 Test: $test_name"
    echo "Mensaje: $message"
    
    response=$(curl -s -X POST "$API_BASE/assistant" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "{
            \"messages\": [],
            \"message\": \"$message\",
            \"context\": {
                \"userId\": \"test-user\",
                \"tenantId\": \"test-tenant\"
            }
        }")
    
    if echo "$response" | jq -e '.toolCalls' > /dev/null 2>&1; then
        tool_count=$(echo "$response" | jq '.toolCalls | length')
        if [ "$tool_count" -gt 0 ]; then
            echo "✅ PASS - Tool calls generados: $tool_count"
            echo "$response" | jq -r '.toolCalls[0] | "   Herramienta: \(.type), Entidad: \(.parameters.entity // "N/A")"'
        else
            echo "⚠️  WARN - No se generaron tool calls"
        fi
    else
        echo "❌ FAIL - Respuesta inválida o error"
        echo "   Respuesta: $(echo "$response" | jq -r '.message // .error // "Error desconocido"')"
    fi
    
    echo ""
}

# Tests de regresión - Consultas (Find)
echo "🔍 TESTS DE CONSULTA (FIND)"
echo "----------------------------------------"

run_test "Consulta simple de edificios" \
    "Muéstrame todos los edificios" \
    "find" "Building"

run_test "Búsqueda de tickets abiertos" \
    "Busca todos los tickets que están abiertos" \
    "find" "Ticket"

run_test "Consulta de facturas vencidas" \
    "Encuentra las facturas que están vencidas" \
    "find" "Invoice"

run_test "Listado de usuarios activos" \
    "Lista todos los usuarios activos del sistema" \
    "find" "User"

run_test "Consulta de unidades por edificio" \
    "Muestra las unidades del edificio con ID 123" \
    "find" "Unit"

run_test "Búsqueda de órdenes de trabajo pendientes" \
    "Busca las órdenes de trabajo que están pendientes" \
    "find" "WorkOrder"

run_test "Consulta de inspecciones programadas" \
    "Muestra las inspecciones programadas para esta semana" \
    "find" "Inspection"

run_test "Listado de proveedores disponibles" \
    "Lista todos los proveedores que están disponibles" \
    "find" "Vendor"

run_test "Consulta de materiales con stock bajo" \
    "Encuentra los materiales que tienen stock bajo" \
    "find" "Material"

run_test "Búsqueda de gastos del mes actual" \
    "Busca todos los gastos del mes actual" \
    "find" "Expense"

# Tests de regresión - Operaciones (Create/Update)
echo "✏️ TESTS DE OPERACIONES (CREATE/UPDATE)"
echo "----------------------------------------"

run_test "Creación de ticket (dry-run)" \
    "Crea un nuevo ticket para reparar la puerta del edificio A" \
    "create" "Ticket"

run_test "Actualización de estado de ticket" \
    "Cambia el estado del ticket 456 a en progreso" \
    "update" "Ticket"

run_test "Creación de orden de trabajo" \
    "Crea una orden de trabajo para mantenimiento de ascensor" \
    "create" "WorkOrder"

run_test "Actualización de información de usuario" \
    "Actualiza el email del usuario Juan Pérez a juan.nuevo@email.com" \
    "update" "User"

run_test "Programación de inspección" \
    "Programa una inspección para el edificio B el próximo lunes" \
    "create" "Inspection"

# Tests de regresión - Consultas complejas
echo "🔬 TESTS DE CONSULTAS COMPLEJAS"
echo "----------------------------------------"

run_test "Consulta compleja con filtros múltiples" \
    "Busca tickets abiertos del edificio A creados en los últimos 30 días" \
    "find" "Ticket"

run_test "Consulta de relaciones entre entidades" \
    "Muestra todos los usuarios que viven en el edificio Torre Norte" \
    "find" "User"

run_test "Consulta de estadísticas" \
    "Cuántos tickets se resolvieron este mes" \
    "find" "Ticket"

run_test "Búsqueda por rango de fechas" \
    "Encuentra las facturas emitidas entre el 1 y 15 de este mes" \
    "find" "Invoice"

run_test "Consulta de disponibilidad" \
    "Verifica qué proveedores están disponibles para trabajar mañana" \
    "find" "Vendor"

# Test de salud del asistente
echo "🏥 TEST DE SALUD DEL ASISTENTE"
echo "----------------------------------------"

echo "📝 Test: Health Check"
health_response=$(curl -s -X GET "$API_BASE/assistant/health" \
    -H "Authorization: Bearer $JWT_TOKEN")

if echo "$health_response" | jq -e '.status' > /dev/null 2>&1; then
    status=$(echo "$health_response" | jq -r '.status')
    llm_status=$(echo "$health_response" | jq -r '.llm')
    catalog_status=$(echo "$health_response" | jq -r '.catalog')
    
    echo "✅ PASS - Estado del asistente: $status"
    echo "   LLM: $llm_status"
    echo "   Catálogo: $catalog_status"
else
    echo "❌ FAIL - Health check falló"
    echo "   Respuesta: $health_response"
fi

echo ""
echo "🎉 Tests de regresión completados!"
echo "=========================================="
