#!/bin/bash

# Script to initialize LLM models in Ollama
# This script should be run after Ollama container is up and healthy

set -e

OLLAMA_HOST=${OLLAMA_HOST:-"http://localhost:11434"}
MODELS_TO_PULL=${MODELS_TO_PULL:-"qwen2.5:7b-instruct"}

echo "🤖 Initializing LLM models..."
echo "Ollama host: $OLLAMA_HOST"
echo "Models to pull: $MODELS_TO_PULL"

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
        echo "✅ Ollama is ready!"
        break
    fi
    
    echo "Attempt $attempt/$max_attempts: Ollama not ready yet, waiting 10 seconds..."
    sleep 10
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Ollama failed to become ready after $max_attempts attempts"
    exit 1
fi

# Pull models
IFS=',' read -ra MODEL_ARRAY <<< "$MODELS_TO_PULL"
for model in "${MODEL_ARRAY[@]}"; do
    model=$(echo "$model" | xargs) # trim whitespace
    echo "📥 Pulling model: $model"
    
    if curl -X POST "$OLLAMA_HOST/api/pull" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$model\"}" \
        --max-time 1800; then # 30 minutes timeout
        echo "✅ Successfully pulled model: $model"
    else
        echo "⚠️  Failed to pull model: $model (continuing with other models)"
    fi
done

# List available models
echo "📋 Available models:"
curl -s "$OLLAMA_HOST/api/tags" | jq -r '.models[].name' 2>/dev/null || echo "Could not list models (jq not available)"

echo "🎉 LLM initialization complete!"
