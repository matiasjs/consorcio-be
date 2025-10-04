# LLM Setup Guide

Este documento explica cómo configurar y usar el sistema de asistente IA con modelos LLM self-hosted.

## Arquitectura

El sistema incluye:
- **Ollama**: Servidor de modelos LLM local
- **LiteLLM**: Gateway OpenAI-compatible que expone los modelos de Ollama
- **Assistant Module**: Módulo NestJS que integra con el LLM

## Configuración Rápida

### 1. Habilitar el Asistente

```bash
# En .env o docker-compose.yml
ASSISTANT_ENABLED=true
ASSISTANT_DEFAULT_MODE=dry-run
LLM_API_BASE=http://llm-gateway:8000/v1
LLM_API_KEY=internal-llm-key-change-in-production
LLM_MODEL=qwen2.5-instruct
```

### 2. Levantar los Servicios LLM

```bash
# Levantar solo los servicios LLM
docker-compose --profile llm up -d

# O levantar todo el stack con LLM
docker-compose --profile dev --profile llm up -d
```

### 3. Inicializar Modelos

```bash
# Ejecutar script de inicialización
docker exec consorcios-ollama bash -c "
  ollama pull qwen2.5:7b-instruct
"

# O usar el script personalizado
./scripts/init-llm.sh
```

## Modelos Disponibles

### CPU (Recomendado para desarrollo)
- `qwen2.5:7b-instruct` - Modelo base, ~4GB RAM

### GPU 8-12GB
- `qwen2.5:7b-instruct` - Modelo base en GPU
- `qwen2.5:14b-instruct` - Modelo mejorado, ~8GB VRAM

### GPU 24GB+
- `qwen2.5:32b-instruct` - Modelo avanzado, ~20GB VRAM

## Configuración GPU (NVIDIA)

Para habilitar GPU, descomenta en `docker-compose.yml`:

```yaml
ollama:
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

## Verificación

### 1. Health Check

```bash
# Verificar Ollama
curl http://localhost:11434/api/tags

# Verificar LiteLLM Gateway
curl http://localhost:8000/v1/models

# Verificar Assistant API
curl -H "Authorization: Bearer YOUR_JWT" \
     http://localhost:3000/api/assistant/health
```

### 2. Test Básico

```bash
# Test directo con LiteLLM
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer internal-llm-key-change-in-production" \
  -d '{
    "model": "qwen2.5-instruct",
    "messages": [{"role": "user", "content": "Hola, ¿cómo estás?"}],
    "max_tokens": 100
  }'
```

## Troubleshooting

### Problema: Ollama no responde
```bash
# Verificar logs
docker logs consorcios-ollama

# Reiniciar servicio
docker-compose restart ollama
```

### Problema: Modelo no encontrado
```bash
# Listar modelos disponibles
docker exec consorcios-ollama ollama list

# Descargar modelo manualmente
docker exec consorcios-ollama ollama pull qwen2.5:7b-instruct
```

### Problema: Gateway no conecta con Ollama
```bash
# Verificar conectividad de red
docker exec consorcios-llm-gateway ping ollama

# Verificar configuración
docker exec consorcios-llm-gateway cat /app/config.yaml
```

### Problema: Assistant API falla
```bash
# Verificar variables de entorno
docker exec consorcios-app-dev env | grep ASSISTANT

# Verificar logs del backend
docker logs consorcios-app-dev
```

## Configuración de Producción

### Variables de Entorno Críticas

```bash
# Seguridad
LLM_API_KEY=your-secure-api-key-here

# Performance
LITELLM_RPM=1000
LITELLM_TPM=100000

# Logging
LITELLM_LOG=ERROR
LOG_LEVEL=warn
```

### Recursos Recomendados

- **CPU**: 4+ cores
- **RAM**: 8GB+ (16GB+ para modelos grandes)
- **GPU**: NVIDIA con 8GB+ VRAM (opcional)
- **Disco**: 20GB+ para modelos

## Monitoreo

### Métricas Importantes

- Latencia de respuesta del LLM
- Uso de memoria/GPU
- Rate limiting
- Errores de API

### Logs

```bash
# Logs del asistente
docker logs consorcios-app-dev | grep Assistant

# Logs de LiteLLM
docker logs consorcios-llm-gateway

# Logs de Ollama
docker logs consorcios-ollama
```

## Desarrollo

### Agregar Nuevos Modelos

1. Actualizar `llm-config.yaml`
2. Agregar modelo a `scripts/init-llm.sh`
3. Reiniciar servicios LLM

### Testing Local

```bash
# Ejecutar tests del asistente
npm run test -- --testNamePattern="Assistant"

# Test de integración
npm run test:integration -- assistant
```
