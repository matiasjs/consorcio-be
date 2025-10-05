# Script completo para levantar el sistema con LLM
# Ejecuta todos los pasos necesarios para tener el asistente funcionando

param(
    [switch]$SkipModelPull,
    [string]$ModelToPull = "qwen2.5:7b-instruct"
)

Write-Host "🚀 Iniciando sistema completo con Asistente IA..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecutar desde el directorio raíz del proyecto backend" -ForegroundColor Red
    exit 1
}

# Verificar que Docker está corriendo
try {
    docker version | Out-Null
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: Docker no está corriendo o no está instalado" -ForegroundColor Red
    exit 1
}

# Paso 1: Levantar servicios base
Write-Host "`n📦 PASO 1: Levantando servicios base..." -ForegroundColor Yellow
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
Write-Host "⏳ Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        docker exec consorcios-postgres pg_isready -U postgres | Out-Null
        Write-Host "OK PostgreSQL esta listo" -ForegroundColor Green
        break
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts`: PostgreSQL no está listo, esperando 5 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "ERROR: PostgreSQL no se pudo inicializar" -ForegroundColor Red
    exit 1
}

# Paso 2: Levantar servicios LLM
Write-Host "`n🤖 PASO 2: Levantando servicios LLM..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    docker-compose --profile llm up -d
    Write-Host "✅ Servicios LLM levantados (Ollama, LiteLLM)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error levantando servicios LLM" -ForegroundColor Red
    exit 1
}

# Esperar a que Ollama esté listo
Write-Host "⏳ Esperando a que Ollama esté listo..." -ForegroundColor Yellow
$maxAttempts = 60
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Ollama está listo" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts`: Ollama no está listo, esperando 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "❌ Ollama no se pudo inicializar" -ForegroundColor Red
    exit 1
}

# Paso 3: Descargar modelo (opcional)
if (-not $SkipModelPull) {
    Write-Host "`n📥 PASO 3: Descargando modelo LLM..." -ForegroundColor Yellow
    Write-Host "----------------------------------------"
    Write-Host "Modelo: $ModelToPull" -ForegroundColor Cyan
    Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Yellow

    try {
        & "$PSScriptRoot\init-llm.ps1" -ModelToPull $ModelToPull
        Write-Host "✅ Modelo descargado exitosamente" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Error descargando modelo, pero continuando..." -ForegroundColor Yellow
        Write-Host "Puedes descargarlo manualmente después con: npm run assistant:init-llm" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⏭️  PASO 3: Saltando descarga de modelo (--SkipModelPull)" -ForegroundColor Yellow
}

# Paso 4: Verificar LiteLLM Gateway
Write-Host "`n🌐 PASO 4: Verificando LiteLLM Gateway..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ LiteLLM Gateway está funcionando" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts`: LiteLLM no está listo, esperando 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "⚠️  LiteLLM Gateway no responde, pero continuando..." -ForegroundColor Yellow
}

# Paso 5: Levantar aplicación backend
Write-Host "`n🔧 PASO 5: Levantando aplicación backend..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    docker-compose --profile dev up -d app-dev
    Write-Host "✅ Aplicación backend levantada" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error levantando aplicación backend" -ForegroundColor Red
    exit 1
}

# Verificar que el backend está funcionando
Write-Host "⏳ Verificando que el backend esté funcionando..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend está funcionando" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Intento $attempt/$maxAttempts`: Backend no está listo, esperando 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
    exit 1
}

# Resumen final
Write-Host "`n🎉 SISTEMA INICIADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ PostgreSQL: http://localhost:5432" -ForegroundColor White
Write-Host "✅ Redis: http://localhost:6379" -ForegroundColor White
Write-Host "✅ Ollama: http://localhost:11434" -ForegroundColor White
Write-Host "✅ LiteLLM Gateway: http://localhost:8000" -ForegroundColor White
Write-Host "✅ Backend API: http://localhost:3000" -ForegroundColor White
Write-Host "✅ Swagger UI: http://localhost:3000/api" -ForegroundColor White

Write-Host "`n🤖 PARA HABILITAR EL ASISTENTE:" -ForegroundColor Yellow
Write-Host "1. Configurar variables de entorno:" -ForegroundColor White
Write-Host "   ASSISTANT_ENABLED=true" -ForegroundColor Cyan
Write-Host "   LLM_API_BASE=http://localhost:8000/v1" -ForegroundColor Cyan
Write-Host "   LLM_API_KEY=internal-llm-key-change-in-production" -ForegroundColor Cyan
Write-Host "2. Reiniciar el backend: docker-compose restart app-dev" -ForegroundColor White
Write-Host "3. Probar el asistente: http://localhost:3000/api/v1/assistant/health" -ForegroundColor White

Write-Host "`n📋 COMANDOS ÚTILES:" -ForegroundColor Yellow
Write-Host "Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "Parar todo: docker-compose --profile dev --profile llm down" -ForegroundColor White
Write-Host "Reiniciar LLM: docker-compose restart ollama llm-gateway" -ForegroundColor White
