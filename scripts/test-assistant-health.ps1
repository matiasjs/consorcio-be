#!/usr/bin/env pwsh

# Test Assistant Health Endpoint
Write-Host "Testing Assistant Health Endpoint..." -ForegroundColor Cyan

# Test 1: Health endpoint without auth (should fail)
Write-Host "`n1. Testing health endpoint without authentication..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/assistant/health" -Method GET
    Write-Host "Response: $($response.StatusCode)" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Expected failure (needs auth): $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Try to get a token first (login)
Write-Host "`n2. Attempting to login to get auth token..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.access_token) {
        Write-Host "Login successful!" -ForegroundColor Green
        $token = $loginData.access_token
        
        # Test 3: Health endpoint with auth
        Write-Host "`n3. Testing health endpoint with authentication..." -ForegroundColor Yellow
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $healthResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/assistant/health" -Method GET -Headers $headers
        Write-Host "Health check successful: $($healthResponse.StatusCode)" -ForegroundColor Green
        Write-Host $healthResponse.Content

    } else {
        Write-Host "No access token in login response" -ForegroundColor Red
    }
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "This might be expected if no admin user exists yet." -ForegroundColor Yellow
}

# Test 4: Check if LLM services are running
Write-Host "`n4. Checking LLM services..." -ForegroundColor Yellow

# Check Ollama
try {
    $ollamaResponse = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET
    Write-Host "Ollama is running" -ForegroundColor Green
} catch {
    Write-Host "Ollama not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Check LiteLLM Gateway
try {
    $litellmResponse = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method GET
    Write-Host "LiteLLM Gateway is running" -ForegroundColor Green
} catch {
    Write-Host "LiteLLM Gateway not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Cyan
