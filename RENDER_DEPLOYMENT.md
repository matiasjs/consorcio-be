# Render Deployment Guide

## Service Information
- **Service ID**: srv-d31g43jipnbc73e35keg
- **URL**: https://consorcio-be.onrender.com

## Required Environment Variables

### Database Configuration
```bash
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
```

### Application Configuration
```bash
NODE_ENV=production
PORT=10000
API_VERSION=v1
API_PREFIX=api
```

### JWT Configuration (Generate strong secrets)
```bash
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### CORS Configuration
```bash
CORS_ORIGIN=https://your-frontend-domain.com
```

### Optional Configuration
```bash
REDIS_URL=redis://username:password@host:port
THROTTLE_TTL=60
THROTTLE_LIMIT=100
HELMET_ENABLED=true
```

## Deployment Steps

### 1. Set Environment Variables in Render Dashboard

Go to your service dashboard and add these environment variables:

**Required:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate a strong secret (32+ characters)
- `JWT_REFRESH_SECRET` - Generate another strong secret
- `CORS_ORIGIN` - Your frontend domain

**Optional:**
- `REDIS_URL` - If using Redis for caching
- Other configuration variables as needed

### 2. Database Setup

The application will automatically:
1. Run migrations on startup
2. Seed initial data (roles, permissions, demo users)

### 3. Health Check

The service includes a health check endpoint at `/api/v1/health` that Render will use to monitor the service.

### 4. Initial Users

After deployment, you can login with these demo users:

```bash
# Administrator
Email: admin@demo.com
Password: Admin123!

# Secretary
Email: secretaria@demo.com
Password: Admin123!

# Owner
Email: owner@demo.com
Password: Admin123!

# Tenant
Email: tenant@demo.com
Password: Admin123!
```

## API Documentation

Once deployed, you can access the Swagger documentation at:
https://consorcio-be.onrender.com/api/docs

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check if database service is running
   - Ensure SSL is properly configured

2. **Migration Failures**
   - Check database permissions
   - Verify migration files are included in build
   - Check logs for specific error messages

3. **JWT Errors**
   - Ensure JWT_SECRET and JWT_REFRESH_SECRET are set
   - Verify secrets are strong enough (32+ characters)

### Useful Commands

```bash
# Check service logs
render logs --service srv-d31g43jipnbc73e35keg

# Restart service
render restart --service srv-d31g43jipnbc73e35keg

# Check environment variables
render env --service srv-d31g43jipnbc73e35keg
```

### Manual Migration (if needed)

If automatic migrations fail, you can run them manually:

```bash
# Connect to your service shell
render shell --service srv-d31g43jipnbc73e35keg

# Run migrations
npm run migration:run

# Run seeds
npm run db:seed
```

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to repository
   - Use strong, unique JWT secrets
   - Rotate secrets regularly

2. **Database**
   - Use SSL connections (enabled by default)
   - Limit database access to application only
   - Regular backups

3. **CORS**
   - Set specific frontend domains
   - Avoid using wildcards in production

## Monitoring

- Health check: https://consorcio-be.onrender.com/api/v1/health
- Logs: Available in Render dashboard
- Metrics: Monitor response times and error rates
