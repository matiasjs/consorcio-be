# Script simplificado para levantar el sistema con LLM
# Sin caracteres especiales para evitar problemas de encoding

param(
    [switch]$SkipModelPull,
    [string]$ModelToPull = "qwen2.5:7b-instruct"
)

Write-Host "Iniciando sistema completo con Asistente IA..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: Ejecutar desde el directorio raiz del proyecto backend" -ForegroundColor Red
    exit 1
}

# Verificar que Docker está corriendo
try {
    docker version | Out-Null
    Write-Host "OK Docker esta corriendo" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Docker no esta corriendo o no esta instalado" -ForegroundColor Red
    exit 1
}

# Paso 1: Levantar servicios base
Write-Host ""
Write-Host "PASO 1: Levantando servicios base..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    docker-compose --profile dev up -d postgres redis
    Write-Host "OK Servicios base levantados (PostgreSQL, Redis)" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Error levantando servicios base" -ForegroundColor Red
    exit 1
}

# Esperar a que PostgreSQL esté listo
Write-Host "Esperando a que PostgreSQL este listo..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        docker exec consorcios-postgres pg_isready -U postgres | Out-Null
        Write-Host "OK PostgreSQL esta listo" -ForegroundColor Green
        break
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts - PostgreSQL no esta listo, esperando 5 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "ERROR: PostgreSQL no se pudo inicializar" -ForegroundColor Red
    exit 1
}

# Paso 2: Levantar servicios LLM
Write-Host ""
Write-Host "PASO 2: Levantando servicios LLM..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    docker-compose --profile llm up -d
    Write-Host "OK Servicios LLM levantados (Ollama, LiteLLM)" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Error levantando servicios LLM" -ForegroundColor Red
    exit 1
}

# Esperar a que Ollama esté listo
Write-Host "Esperando a que Ollama este listo..." -ForegroundColor Yellow
$maxAttempts = 60
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "OK Ollama esta listo" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts - Ollama no esta listo, esperando 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "ERROR: Ollama no se pudo inicializar" -ForegroundColor Red
    exit 1
}

# Paso 3: Descargar modelo (opcional)
if (-not $SkipModelPull) {
    Write-Host ""
    Write-Host "PASO 3: Descargando modelo LLM..." -ForegroundColor Yellow
    Write-Host "----------------------------------------"
    Write-Host "Modelo: $ModelToPull" -ForegroundColor Cyan
    Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Yellow

    try {
        $body = @{
            name = $ModelToPull
        } | ConvertTo-Json

        Write-Host "Iniciando descarga del modelo..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/pull" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 1800

        if ($response.StatusCode -eq 200) {
            Write-Host "OK Modelo descargado exitosamente" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Fallo al descargar modelo" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "ADVERTENCIA: Error descargando modelo, pero continuando..." -ForegroundColor Yellow
        Write-Host "Puedes descargarlo manualmente despues con: npm run assistant:init-llm" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "PASO 3: Saltando descarga de modelo (--SkipModelPull)" -ForegroundColor Yellow
}

# Paso 4: Verificar LiteLLM Gateway
Write-Host ""
Write-Host "PASO 4: Verificando LiteLLM Gateway..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "OK LiteLLM Gateway esta funcionando" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts - LiteLLM no esta listo, esperando 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "ADVERTENCIA: LiteLLM Gateway no responde, pero continuando..." -ForegroundColor Yellow
}

# Paso 5: Configurar variables de entorno
Write-Host ""
Write-Host "PASO 5: Configurando variables de entorno..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.development") {
        Copy-Item ".env.development" ".env"
        Write-Host "OK Archivo .env creado desde .env.development" -ForegroundColor Green
    } else {
        Write-Host "ADVERTENCIA: No se encontro .env.development" -ForegroundColor Yellow
    }
} else {
    Write-Host "OK Archivo .env ya existe" -ForegroundColor Green
}

# Paso 6: Levantar aplicación backend
Write-Host ""
Write-Host "PASO 6: Levantando aplicacion backend..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    docker-compose --profile dev up -d app-dev
    Write-Host "OK Aplicacion backend levantada" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Error levantando aplicacion backend" -ForegroundColor Red
    exit 1
}

# Verificar que el backend está funcionando
Write-Host "Verificando que el backend este funcionando..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "OK Backend esta funcionando" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts - Backend no esta listo, esperando 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "ERROR: Backend no responde" -ForegroundColor Red
    exit 1
}

# Resumen final
Write-Host ""
Write-Host "SISTEMA INICIADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "OK PostgreSQL: http://localhost:5432" -ForegroundColor White
Write-Host "OK Redis: http://localhost:6379" -ForegroundColor White
Write-Host "OK Ollama: http://localhost:11434" -ForegroundColor White
Write-Host "OK LiteLLM Gateway: http://localhost:8000" -ForegroundColor White
Write-Host "OK Backend API: http://localhost:3000" -ForegroundColor White
Write-Host "OK Swagger UI: http://localhost:3000/api" -ForegroundColor White

Write-Host ""
Write-Host "PARA PROBAR EL ASISTENTE:" -ForegroundColor Yellow
Write-Host "1. Ir a: http://localhost:3000/api/v1/assistant/health" -ForegroundColor White
Write-Host "2. Deberia responder con status OK" -ForegroundColor White
Write-Host "3. Usar Swagger UI para probar endpoints" -ForegroundColor White

Write-Host ""
Write-Host "COMANDOS UTILES:" -ForegroundColor Yellow
Write-Host "Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "Parar todo: docker-compose --profile dev --profile llm down" -ForegroundColor White
Write-Host "Reiniciar LLM: docker-compose restart ollama llm-gateway" -ForegroundColor White
