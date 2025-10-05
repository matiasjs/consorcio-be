# Script to initialize LLM models in Ollama (PowerShell version)
# This script should be run after Ollama container is up and healthy

param(
    [string]$OllamaHost = "http://localhost:11434",
    [string]$ModelToPull = "qwen2.5:7b-instruct"
)

Write-Host "🤖 Initializing LLM models..." -ForegroundColor Green
Write-Host "Ollama host: $OllamaHost"
Write-Host "Model to pull: $ModelToPull"

# Wait for Ollama to be ready
Write-Host "⏳ Waiting for Ollama to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "$OllamaHost/api/tags" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Ollama is ready!" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Attempt $attempt/$maxAttempts`: Ollama not ready yet, waiting 10 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "❌ Ollama failed to become ready after $maxAttempts attempts" -ForegroundColor Red
    exit 1
}

# Pull model
Write-Host "📥 Pulling model: $ModelToPull" -ForegroundColor Cyan
Write-Host "This may take several minutes depending on your internet connection..." -ForegroundColor Yellow

try {
    $body = @{
        name = $ModelToPull
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$OllamaHost/api/pull" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 1800

    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Successfully pulled model: $ModelToPull" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to pull model: $ModelToPull" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Failed to pull model: $ModelToPull" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# List available models
Write-Host "📋 Available models:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$OllamaHost/api/tags" -Method GET
    $models = ($response.Content | ConvertFrom-Json).models
    foreach ($model in $models) {
        Write-Host "  - $($model.name)" -ForegroundColor White
    }
}
catch {
    Write-Host "Could not list models" -ForegroundColor Yellow
}

Write-Host "🎉 LLM initialization complete!" -ForegroundColor Green
