#!/bin/bash

# Script to initialize LLM models in Ollama
# This script should be run after Ollama container is up and healthy

set -e

OLLAMA_HOST=${OLLAMA_HOST:-"http://localhost:11434"}
MODEL_TO_PULL=${MODEL_TO_PULL:-"qwen2.5:7b-instruct"}

echo "🤖 Initializing LLM models..."
echo "Ollama host: $OLLAMA_HOST"
echo "Model to pull: $MODEL_TO_PULL"

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

# Pull model
echo "📥 Pulling model: $MODEL_TO_PULL"
echo "This may take several minutes depending on your internet connection..."

if curl -X POST "$OLLAMA_HOST/api/pull" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$MODEL_TO_PULL\"}" \
    --max-time 1800; then # 30 minutes timeout
    echo "✅ Successfully pulled model: $MODEL_TO_PULL"
else
    echo "❌ Failed to pull model: $MODEL_TO_PULL"
    exit 1
fi

# List available models
echo "📋 Available models:"
curl -s "$OLLAMA_HOST/api/tags" 2>/dev/null || echo "Could not list models"

echo "🎉 LLM initialization complete!"
