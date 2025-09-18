#!/usr/bin/env node

/**
 * Environment validation script for production deployment
 * Checks that all required environment variables are set
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'NODE_ENV',
];

const optionalEnvVars = [
  'CORS_ORIGIN',
  'REDIS_URL',
  'PORT',
  'API_VERSION',
  'API_PREFIX',
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD') 
      ? '***HIDDEN***' 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n📋 Optional variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️  ${varName}: NOT SET (using default)`);
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
});

// Additional validations
console.log('\n🔐 Security checks:');

// Check JWT secret strength
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret && jwtSecret.length < 32) {
  console.log('❌ JWT_SECRET should be at least 32 characters long');
  hasErrors = true;
} else if (jwtSecret) {
  console.log('✅ JWT_SECRET length is adequate');
}

const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
if (jwtRefreshSecret && jwtRefreshSecret.length < 32) {
  console.log('❌ JWT_REFRESH_SECRET should be at least 32 characters long');
  hasErrors = true;
} else if (jwtRefreshSecret) {
  console.log('✅ JWT_REFRESH_SECRET length is adequate');
}

// Check if secrets are different
if (jwtSecret && jwtRefreshSecret && jwtSecret === jwtRefreshSecret) {
  console.log('❌ JWT_SECRET and JWT_REFRESH_SECRET should be different');
  hasErrors = true;
} else if (jwtSecret && jwtRefreshSecret) {
  console.log('✅ JWT secrets are different');
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Environment validation FAILED');
  console.log('Please set the missing required variables before deployment.');
  process.exit(1);
} else {
  console.log('✅ Environment validation PASSED');
  console.log('All required variables are set and valid.');
}
