# LLM Provider Configuration

El sistema de asistente soporta múltiples proveedores de LLM a través de una interfaz unificada. Puedes cambiar fácilmente entre Ollama local y OpenAI API.

## Proveedores Soportados

### 1. Ollama (Local)
- **Ventajas**: Privacidad completa, sin costos por token, control total
- **Desventajas**: Requiere recursos locales, setup más complejo
- **Modelos recomendados**: qwen2.5-instruct, llama3.1, mistral

### 2. OpenAI API
- **Ventajas**: Sin setup local, modelos muy potentes, alta disponibilidad
- **Desventajas**: Costos por token, datos enviados a terceros
- **Modelos recomendados**: gpt-4o-mini (costo-efectivo), gpt-4o (máximo rendimiento)

## Configuración

### Para usar Ollama (configuración actual):

```env
LLM_PROVIDER=ollama
LLM_API_BASE=http://localhost:8000/v1
LLM_API_KEY=internal-llm-key-change-in-production
LLM_MODEL=qwen2.5-instruct
```

### Para usar OpenAI:

```env
LLM_PROVIDER=openai
LLM_API_BASE=https://api.openai.com/v1
LLM_API_KEY=sk-your-actual-openai-api-key
LLM_MODEL=gpt-4o-mini
```

## Cambio de Proveedor

1. **Detén el backend**: `Ctrl+C` en la terminal donde corre el backend
2. **Modifica el archivo `.env`** con las variables del proveedor deseado
3. **Reinicia el backend**: `npm run start:dev`

## Modelos Recomendados por Proveedor

### Ollama
- **qwen2.5-instruct**: Excelente para español, bueno con tool calling
- **llama3.1**: Muy bueno para razonamiento general
- **mistral**: Rápido y eficiente

### OpenAI
- **gpt-4o-mini**: Mejor relación costo/rendimiento
- **gpt-4o**: Máximo rendimiento para casos complejos
- **gpt-3.5-turbo**: Opción económica básica

## Consideraciones de Costos

### Ollama (Local)
- **Costo**: $0 por token (solo electricidad y hardware)
- **Recursos**: ~8GB RAM para modelos 7B, ~16GB para modelos 13B

### OpenAI
- **gpt-4o-mini**: ~$0.15 por 1M tokens de entrada, ~$0.60 por 1M tokens de salida
- **gpt-4o**: ~$2.50 por 1M tokens de entrada, ~$10.00 por 1M tokens de salida

## Troubleshooting

### Ollama no responde
1. Verifica que Docker esté corriendo: `docker ps`
2. Verifica que LiteLLM Gateway esté funcionando: `curl http://localhost:8000/health`
3. Verifica que Ollama tenga el modelo: `docker exec ollama ollama list`

### OpenAI API errors
1. Verifica tu API key en https://platform.openai.com/api-keys
2. Verifica que tengas créditos disponibles
3. Verifica los rate limits de tu cuenta

## Arquitectura

El sistema usa un adaptador (`LlmProviderAdapter`) que:
1. **Detecta el proveedor** configurado en `LLM_PROVIDER`
2. **Aplica configuraciones específicas** para cada proveedor
3. **Normaliza las respuestas** a un formato común
4. **Maneja errores** específicos de cada proveedor

Esto permite cambiar de proveedor sin modificar el código de la aplicación.
