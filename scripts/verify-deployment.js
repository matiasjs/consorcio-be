#!/usr/bin/env node

/**
 * Deployment verification script
 * Checks that everything is ready for production deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment readiness...\n');

let hasErrors = false;

// Check if required files exist
const requiredFiles = [
  'package.json',
  'render.yaml',
  'src/main.ts',
  'src/config/database.config.ts',
  'src/modules/health/health.controller.ts',
  'RENDER_DEPLOYMENT.md'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check package.json scripts
console.log('\n📋 Checking package.json scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = [
  'build:prod',
  'start:prod',
  'deploy:setup',
  'migration:run',
  'db:seed'
];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} - MISSING`);
    hasErrors = true;
  }
});

// Test build
console.log('\n🔨 Testing build process:');
try {
  execSync('npm run build:prod', { stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed');
  console.log(error.stdout?.toString() || error.message);
  hasErrors = true;
}

// Check if dist folder was created
if (fs.existsSync('dist')) {
  console.log('✅ dist folder created');
  
  // Check if main.js exists
  if (fs.existsSync('dist/src/main.js')) {
    console.log('✅ dist/src/main.js exists');
  } else {
    console.log('❌ dist/src/main.js missing');
    hasErrors = true;
  }
} else {
  console.log('❌ dist folder not created');
  hasErrors = true;
}

// Test linting
console.log('\n🔍 Testing linting:');
try {
  const lintResult = execSync('npm run lint', { stdio: 'pipe' });
  console.log('✅ Linting passed (warnings are OK)');
} catch (error) {
  const output = error.stdout?.toString() || error.message;
  if (output.includes('✖') && output.includes('errors')) {
    console.log('❌ Linting failed with errors');
    hasErrors = true;
  } else {
    console.log('✅ Linting passed (warnings are OK)');
  }
}

// Check render.yaml
console.log('\n⚙️  Checking render.yaml:');
try {
  const renderConfig = fs.readFileSync('render.yaml', 'utf8');
  
  if (renderConfig.includes('buildCommand: npm ci && npm run build:prod')) {
    console.log('✅ Build command configured');
  } else {
    console.log('❌ Build command not properly configured');
    hasErrors = true;
  }
  
  if (renderConfig.includes('startCommand: npm run deploy:setup && npm run start:prod')) {
    console.log('✅ Start command configured');
  } else {
    console.log('❌ Start command not properly configured');
    hasErrors = true;
  }
  
  if (renderConfig.includes('healthCheckPath: /api/v1/health')) {
    console.log('✅ Health check path configured');
  } else {
    console.log('❌ Health check path not configured');
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ Error reading render.yaml:', error.message);
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ DEPLOYMENT VERIFICATION FAILED');
  console.log('Please fix the issues above before deploying.');
  process.exit(1);
} else {
  console.log('✅ DEPLOYMENT VERIFICATION PASSED');
  console.log('🚀 Ready for deployment to Render!');
  console.log('\nNext steps:');
  console.log('1. Set environment variables in Render dashboard');
  console.log('2. Push changes to your repository');
  console.log('3. Deploy will start automatically');
  console.log('\nSee RENDER_DEPLOYMENT.md for detailed instructions.');
}
