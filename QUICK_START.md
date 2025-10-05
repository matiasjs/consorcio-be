# 🚀 Guía de Inicio Rápido - Asistente IA

Esta guía te ayudará a levantar el sistema completo con el Asistente IA funcionando en **menos de 10 minutos**.

## 📋 Prerrequisitos

- ✅ **Docker Desktop** instalado y corriendo
- ✅ **Node.js 18+** instalado
- ✅ **PowerShell** (Windows) o **Bash** (Linux/Mac)
- ✅ **8GB+ RAM** disponible
- ✅ **Conexión a internet** para descargar modelos

## 🎯 Opción 1: Inicio Automático (Recomendado)

### Paso 1: Ejecutar Script Automático
```powershell
# En el directorio consorcios-backend
npm run assistant:start
```

Este script hace todo automáticamente:
- ✅ Levanta PostgreSQL y Redis
- ✅ Levanta Ollama y LiteLLM
- ✅ Descarga el modelo Qwen 2.5 (7B)
- ✅ Levanta el backend con el asistente habilitado
- ✅ Verifica que todo esté funcionando

### Paso 2: Verificar que Funciona
```powershell
# Verificar salud del asistente
curl http://localhost:3000/api/v1/assistant/health
```

**¡Listo!** El asistente ya está funcionando.

## 🔧 Opción 2: Paso a Paso Manual

### Paso 1: Configurar Variables de Entorno
```powershell
# Copiar configuración de desarrollo
copy .env.development .env
```

### Paso 2: Levantar Servicios Base
```powershell
# PostgreSQL y Redis
docker-compose --profile dev up -d postgres redis

# Esperar a que estén listos (30-60 segundos)
docker-compose logs -f postgres
```

### Paso 3: Levantar Servicios LLM
```powershell
# Ollama y LiteLLM Gateway
npm run llm:up

# Ver logs para verificar
npm run llm:logs
```

### Paso 4: Descargar Modelo LLM
```powershell
# Descargar Qwen 2.5 (7B) - toma 5-10 minutos
npm run assistant:init-llm
```

### Paso 5: Levantar Backend
```powershell
# Backend con asistente habilitado
docker-compose --profile dev up -d app-dev

# O en modo desarrollo local
npm run start:dev
```

### Paso 6: Verificar Funcionamiento
```powershell
# API Health
curl http://localhost:3000/api/v1/health

# Assistant Health
curl http://localhost:3000/api/v1/assistant/health

# LLM Gateway
curl http://localhost:8000/health
```

## 🧪 Probar el Asistente

### 1. Via API (Postman/curl)
```bash
# Login para obtener JWT
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local.com","password":"Admin123!"}'

# Usar el asistente
curl -X POST http://localhost:3000/api/v1/assistant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Muéstrame todos los edificios",
    "context": {"userId": "admin-user"}
  }'
```

### 2. Via Frontend
1. Levantar el frontend: `cd ../consorcio-fe && npm run dev`
2. Ir a: http://localhost:5173/chat
3. Hacer login con: `admin@local.com` / `Admin123!`
4. Probar el chat con el asistente

## 🔍 Verificar Estado de Servicios

### Servicios Corriendo
```powershell
docker ps
```

Deberías ver:
- ✅ `consorcios-postgres` (Puerto 5432)
- ✅ `consorcios-redis` (Puerto 6379)
- ✅ `consorcios-ollama` (Puerto 11434)
- ✅ `consorcios-llm-gateway` (Puerto 8000)
- ✅ `consorcios-app-dev` (Puerto 3000)

### URLs de Verificación
- 🔗 **Backend API**: http://localhost:3000/api/v1/health
- 🔗 **Swagger UI**: http://localhost:3000/api
- 🔗 **Ollama**: http://localhost:11434/api/tags
- 🔗 **LiteLLM**: http://localhost:8000/health
- 🔗 **Assistant Health**: http://localhost:3000/api/v1/assistant/health

## ❌ Solución de Problemas

### Problema: Docker no inicia
```powershell
# Verificar Docker
docker version

# Reiniciar Docker Desktop si es necesario
```

### Problema: Puerto ocupado
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar proceso si es necesario
taskkill /PID <PID> /F
```

### Problema: Ollama no descarga modelo
```powershell
# Verificar conectividad
curl http://localhost:11434/api/tags

# Descargar manualmente
docker exec consorcios-ollama ollama pull qwen2.5:7b-instruct
```

### Problema: LiteLLM no conecta con Ollama
```powershell
# Verificar red de Docker
docker network ls

# Reiniciar servicios LLM
docker-compose restart ollama llm-gateway
```

### Problema: Backend no encuentra LLM
```powershell
# Verificar variables de entorno
docker exec consorcios-app-dev env | grep ASSISTANT

# Verificar configuración
curl http://localhost:8000/v1/models
```

## 🛑 Parar Todo

```powershell
# Parar todos los servicios
docker-compose --profile dev --profile llm down

# Limpiar volúmenes (opcional)
docker-compose down -v
```

## 📚 Próximos Pasos

1. **Explorar el Chat**: Ir a `/chat` en el frontend
2. **Probar Tool Calls**: "Crea un nuevo ticket para reparar la puerta"
3. **Ver Documentación**: Leer `LLM_SETUP.md` para configuración avanzada
4. **Ejecutar Tests**: `npm run assistant:test:all`
5. **Configurar GPU**: Descomentar sección GPU en `docker-compose.yml`

## 💡 Consejos

- 🔥 **Primera vez**: Usa el script automático (`npm run assistant:start`)
- ⚡ **Desarrollo**: Usa `npm run dev:full` para levantar todo
- 🐛 **Debug**: Usa `npm run llm:logs` para ver logs de LLM
- 🧪 **Testing**: Usa `npm run assistant:test:regression` para probar
- 📊 **Monitoreo**: Usa Swagger UI para explorar APIs

**¡El asistente IA está listo para usar!** 🎉
