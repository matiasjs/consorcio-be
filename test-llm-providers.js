/**
 * Script de prueba para verificar el adaptador de proveedores LLM
 * Este script simula las llamadas que haría el backend para probar ambos proveedores
 */

// Usar fetch nativo de Node.js (disponible desde v18)

// Configuraciones de prueba
const configs = {
  ollama: {
    provider: 'ollama',
    apiBase: 'http://localhost:8000/v1',
    apiKey: 'internal-llm-key-change-in-production',
    model: 'qwen2.5-instruct'
  },
  openai: {
    provider: 'openai',
    apiBase: 'https://api.openai.com/v1',
    apiKey: 'sk-your-openai-api-key-here', // Reemplazar con clave real para probar
    model: 'gpt-4o-mini'
  }
};

// Mensaje de prueba
const testMessages = [
  {
    role: 'system',
    content: 'Eres un asistente útil. Responde de manera concisa.'
  },
  {
    role: 'user',
    content: 'Hola, ¿cómo estás?'
  }
];

// Función para probar un proveedor
async function testProvider(providerName, config) {
  console.log(`\n🧪 Probando proveedor: ${providerName.toUpperCase()}`);
  console.log(`📡 API Base: ${config.apiBase}`);
  console.log(`🤖 Modelo: ${config.model}`);
  
  try {
    const requestBody = {
      model: config.model,
      messages: testMessages,
      temperature: 0.1,
      max_tokens: 100,
      stream: false,
    };

    console.log(`📤 Enviando request...`);
    
    const response = await fetch(`${config.apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`📥 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
      return false;
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;
    
    console.log(`✅ Respuesta exitosa:`);
    console.log(`💬 Mensaje: ${message}`);
    console.log(`📊 Tokens: ${data.usage?.total_tokens || 'N/A'}`);
    
    return true;
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando pruebas de proveedores LLM...\n');
  
  const results = {};
  
  // Probar Ollama (local)
  results.ollama = await testProvider('ollama', configs.ollama);
  
  // Probar OpenAI (solo si hay API key configurada)
  if (configs.openai.apiKey !== 'sk-your-openai-api-key-here') {
    results.openai = await testProvider('openai', configs.openai);
  } else {
    console.log('\n⚠️  OpenAI: API key no configurada, saltando prueba');
    results.openai = null;
  }
  
  // Resumen
  console.log('\n📋 RESUMEN DE PRUEBAS:');
  console.log('========================');
  console.log(`Ollama (local): ${results.ollama ? '✅ Funcionando' : '❌ Error'}`);
  console.log(`OpenAI (API): ${results.openai === null ? '⚠️  No probado' : results.openai ? '✅ Funcionando' : '❌ Error'}`);
  
  if (results.ollama || results.openai) {
    console.log('\n🎉 Al menos un proveedor está funcionando correctamente!');
    console.log('El adaptador LlmProviderAdapter debería funcionar sin problemas.');
  } else {
    console.log('\n⚠️  Ningún proveedor está disponible actualmente.');
    console.log('Verifica que Docker esté corriendo (para Ollama) o configura una API key de OpenAI.');
  }
  
  console.log('\n📝 Para cambiar de proveedor en el backend:');
  console.log('1. Modifica LLM_PROVIDER en el archivo .env');
  console.log('2. Configura las variables correspondientes (API_KEY, MODEL, etc.)');
  console.log('3. Reinicia el backend');
}

// Ejecutar pruebas
main().catch(console.error);
