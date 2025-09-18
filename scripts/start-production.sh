#!/bin/bash

# Production startup script for Render deployment
# This script runs migrations and seeds before starting the application

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

echo "📊 Database URL configured"

# Wait for database to be ready (optional, but good practice)
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "🔄 Running database migrations..."
npm run migration:run

# Check if this is the first deployment (no existing data)
# Run seeds only if needed
echo "🌱 Running database seeds..."
npm run db:seed || echo "⚠️  Seeds may have already been run, continuing..."

# Start the application
echo "🎯 Starting the application..."
npm run start:prod
