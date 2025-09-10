-- Initialize database for Consorcios Backend
-- This script runs when PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database if not exists (already created by POSTGRES_DB env var)
-- CREATE DATABASE consorcios_db;

-- Set timezone
SET timezone = 'UTC';

-- Create schemas for better organization
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS logs;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE consorcios_db TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA audit TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA logs TO postgres;
