# 🚀 Deployment Guide - Consorcios Backend

## Overview
This guide covers deploying the Consorcios Backend API to production using:
- **Render** for hosting the application
- **Supabase** for PostgreSQL database
- **GitHub Actions** for CI/CD

## Prerequisites

### 1. GitHub Repository
- Push your code to: `git@github.com:matiasjs/consorcio-be.git`
- Ensure all files are committed

### 2. Supabase Database Setup
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Note down these values:
   - `DATABASE_URL` (connection string)
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`

### 3. Render Account
1. Sign up at [Render](https://render.com)
2. Connect your GitHub account

## Deployment Steps

### Step 1: Configure GitHub Secrets
In your GitHub repository, go to Settings > Secrets and variables > Actions, and add:

```
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_render_service_id
```

### Step 2: Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Push the `render.yaml` file to your repository
2. In Render dashboard:
   - Click "New" > "Blueprint"
   - Connect your GitHub repository
   - Select the repository: `matiasjs/consorcio-be`
   - Render will automatically detect the `render.yaml` file

#### Option B: Manual Setup
1. In Render dashboard, click "New" > "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `consorcios-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`

### Step 3: Configure Environment Variables in Render

Add these environment variables in Render:

```bash
# Application
NODE_ENV=production
PORT=3000

# Database (from Supabase)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT (generate secure keys)
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-for-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Redis (Render will provide this)
REDIS_URL=redis://username:password@host:port

# Other configurations
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=false
CORS_ORIGIN=https://your-frontend-domain.com
```

### Step 4: Database Setup
The application will automatically create tables on first run due to `DATABASE_SYNCHRONIZE=true`.

For production, you might want to:
1. Set `DATABASE_SYNCHRONIZE=false`
2. Run migrations manually
3. Create initial admin user

## Environment Variables Reference

### Required Variables
- `DATABASE_URL` - Supabase connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret

### Optional Variables
- `REDIS_URL` - Redis connection (Render provides this)
- `CORS_ORIGIN` - Frontend domain for CORS
- `DATABASE_SYNCHRONIZE` - Auto-create tables (true for initial setup)

## Health Checks

The application includes health check endpoints:
- `GET /api/v1/health` - Application health status
- `GET /api/v1` - API status

## Monitoring

### Logs
- View logs in Render dashboard
- Application logs include request/response info
- Database connection status

### Metrics
- Render provides basic metrics
- Monitor response times and error rates

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify `DATABASE_URL` is correct
   - Check Supabase project is active
   - Ensure SSL is enabled

2. **Application Won't Start**
   - Check build logs in Render
   - Verify all environment variables are set
   - Check Node.js version compatibility

3. **JWT Errors**
   - Ensure JWT secrets are set
   - Verify secret length (minimum 32 characters)

### Debug Commands
```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
npm run typeorm -- query "SELECT 1"

# Check application health
curl https://your-app.onrender.com/api/v1/health
```

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to repository
   - Use strong, unique JWT secrets
   - Rotate secrets regularly

2. **Database**
   - Use SSL connections
   - Limit database access to application only
   - Regular backups

3. **Application**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Use HTTPS only

## Scaling

### Horizontal Scaling
- Render supports auto-scaling
- Configure based on CPU/memory usage

### Database Scaling
- Supabase handles database scaling
- Monitor connection limits
- Consider read replicas for high traffic

## Backup Strategy

### Database Backups
- Supabase provides automatic backups
- Configure backup retention policy
- Test restore procedures

### Application Backups
- Code is backed up in GitHub
- Environment variables documented
- Deployment configuration in render.yaml

## Support

For deployment issues:
1. Check Render logs
2. Verify Supabase status
3. Review GitHub Actions logs
4. Check application health endpoints
