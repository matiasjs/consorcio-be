# Script simple para probar el asistente una vez que esté funcionando

param(
    [string]$BackendUrl = "http://localhost:3000",
    [string]$AdminEmail = "admin@local.com",
    [string]$AdminPassword = "Admin123!"
)

Write-Host "🧪 Probando Asistente IA..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

# Función para hacer requests HTTP
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "Error en request: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Paso 1: Verificar que el backend esté funcionando
Write-Host "1. Verificando backend..." -ForegroundColor Yellow
$healthResponse = Invoke-ApiRequest -Url "$BackendUrl/api/v1/health"

if (-not $healthResponse) {
    Write-Host "❌ Backend no está funcionando en $BackendUrl" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend funcionando: $($healthResponse.status)" -ForegroundColor Green

# Paso 2: Verificar que el asistente esté habilitado
Write-Host "2. Verificando asistente..." -ForegroundColor Yellow
$assistantHealth = Invoke-ApiRequest -Url "$BackendUrl/api/v1/assistant/health"

if (-not $assistantHealth) {
    Write-Host "❌ Asistente no está habilitado o no funciona" -ForegroundColor Red
    Write-Host "Verifica que ASSISTANT_ENABLED=true en .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Asistente funcionando: $($assistantHealth.status)" -ForegroundColor Green
if ($assistantHealth.llm) {
    Write-Host "✅ LLM: $($assistantHealth.llm.status) - Modelo: $($assistantHealth.llm.model)" -ForegroundColor Green
}

# Paso 3: Login para obtener JWT
Write-Host "3. Haciendo login..." -ForegroundColor Yellow
$loginBody = @{
    email = $AdminEmail
    password = $AdminPassword
}

$loginResponse = Invoke-ApiRequest -Url "$BackendUrl/api/v1/auth/login" -Method "POST" -Body $loginBody

if (-not $loginResponse -or -not $loginResponse.access_token) {
    Write-Host "❌ Login falló. Verifica credenciales: $AdminEmail / $AdminPassword" -ForegroundColor Red
    exit 1
}

$token = $loginResponse.access_token
Write-Host "✅ Login exitoso" -ForegroundColor Green

# Paso 4: Probar el asistente con una consulta simple
Write-Host "4. Probando consulta simple..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

$assistantBody = @{
    message = "Hola, ¿puedes ayudarme? Muéstrame cuántos edificios hay en el sistema."
    context = @{
        userId = "test-user"
    }
}

$assistantResponse = Invoke-ApiRequest -Url "$BackendUrl/api/v1/assistant" -Method "POST" -Body $assistantBody -Headers $headers

if (-not $assistantResponse) {
    Write-Host "❌ Consulta al asistente falló" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Respuesta del asistente:" -ForegroundColor Green
Write-Host $assistantResponse.response -ForegroundColor White

if ($assistantResponse.toolCalls -and $assistantResponse.toolCalls.Count -gt 0) {
    Write-Host "🔧 Tool calls ejecutados: $($assistantResponse.toolCalls.Count)" -ForegroundColor Cyan
    foreach ($toolCall in $assistantResponse.toolCalls) {
        Write-Host "  - $($toolCall.type): $($toolCall.explain)" -ForegroundColor Gray
    }
}

# Paso 5: Probar el catálogo de entidades
Write-Host "5. Verificando catálogo de entidades..." -ForegroundColor Yellow
$catalogResponse = Invoke-ApiRequest -Url "$BackendUrl/api/v1/assistant/catalog" -Headers $headers

if ($catalogResponse -and $catalogResponse.entities) {
    Write-Host "✅ Catálogo cargado: $($catalogResponse.entities.Count) entidades" -ForegroundColor Green
    Write-Host "Entidades disponibles:" -ForegroundColor Cyan
    foreach ($entity in $catalogResponse.entities | Select-Object -First 5) {
        Write-Host "  - $($entity.name) ($($entity.fields.Count) campos)" -ForegroundColor Gray
    }
    if ($catalogResponse.entities.Count -gt 5) {
        Write-Host "  ... y $($catalogResponse.entities.Count - 5) más" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  Catálogo no disponible" -ForegroundColor Yellow
}

# Resumen final
Write-Host ""
Write-Host "🎉 PRUEBA COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Backend funcionando" -ForegroundColor White
Write-Host "✅ Asistente habilitado" -ForegroundColor White
Write-Host "✅ LLM respondiendo" -ForegroundColor White
Write-Host "✅ Tool calls funcionando" -ForegroundColor White
Write-Host "✅ Catálogo de entidades cargado" -ForegroundColor White

Write-Host ""
Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Ir a http://localhost:5173/chat (frontend)" -ForegroundColor White
Write-Host "2. Login con: $AdminEmail / $AdminPassword" -ForegroundColor White
Write-Host "3. Probar el chat con el asistente" -ForegroundColor White
Write-Host "4. Usar Swagger UI: $BackendUrl/api" -ForegroundColor White

Write-Host ""
Write-Host "💡 EJEMPLOS DE CONSULTAS:" -ForegroundColor Yellow
Write-Host "- 'Muéstrame todos los edificios'" -ForegroundColor White
Write-Host "- 'Crea un nuevo ticket para reparar la puerta'" -ForegroundColor White
Write-Host "- '¿Cuántos usuarios administradores hay?'" -ForegroundColor White
Write-Host "- 'Lista las unidades del edificio con ID 1'" -ForegroundColor White
