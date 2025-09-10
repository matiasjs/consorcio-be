# 🏢 Consorcios Backend API

> **API REST multi-tenant para gestión de consorcios/edificios**

[![CI/CD](https://github.com/matiasjs/consorcio-be/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/matiasjs/consorcio-be/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 📋 Descripción

Sistema completo de gestión para administraciones de consorcios que incluye:

- **🏗️ Gestión de edificios y unidades**
- **👥 Sistema multi-tenant por administración**
- **🎫 Sistema de tickets/reclamos**
- **🔧 Gestión de proveedores y mantenimiento**
- **📱 API REST con documentación Swagger**
- **🔐 Autenticación JWT con roles**
- **📊 Sistema de mensajería interno**

## 🚀 Tecnologías

- **Backend**: NestJS + TypeScript
- **Base de datos**: PostgreSQL + TypeORM
- **Cache**: Redis
- **Autenticación**: JWT + Passport
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Deployment**: Docker + Render + Supabase

## 📊 Estado del Proyecto

### ✅ Implementado (39 endpoints)
- **Autenticación** (3 endpoints)
- **Administraciones** (5 endpoints)
- **Usuarios** (5 endpoints)
- **Edificios** (5 endpoints)
- **Unidades** (7 endpoints)
- **Proveedores** (9 endpoints)
- **Tickets** (7 endpoints)
- **Mensajes** (4 endpoints)

### 📋 Pendiente (70 endpoints)
- Inspecciones, WorkOrders, Materiales
- Facturas, Pagos, Assets
- Reuniones, Documentos, Notificaciones
- Métricas y Auditoría

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Configuración Local

1. **Clonar el repositorio**
```bash
git clone git@github.com:matiasjs/consorcio-be.git
cd consorcio-be
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar servicios con Docker**
```bash
docker-compose up -d postgres redis
```

5. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:cov

# Tests E2E
npm run test:e2e
```

## 📚 Documentación API

### Swagger UI
- **Local**: http://localhost:3000/api/docs
- **Producción**: https://your-app.onrender.com/api/docs

### Endpoints Principales

```bash
# Autenticación
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me

# Gestión
GET    /api/v1/administrations
POST   /api/v1/administrations
CRUD   /api/v1/users
CRUD   /api/v1/buildings
CRUD   /api/v1/units
CRUD   /api/v1/vendors
CRUD   /api/v1/tickets
```

## 🏗️ Arquitectura

### Base de Datos (31 tablas)
```
📊 Administración: administrations, buildings, units, users
🎫 Tickets: tickets, inspections, work_orders, messages
🔧 Mantenimiento: assets, maintenance_plans, vendors
📋 Reuniones: meetings, resolutions, votes
📄 Documentos: documents, notifications, audit_logs
```

### Estructura del Proyecto
```
src/
├── common/          # Decorators, guards, interceptors
├── config/          # Configuraciones (DB, Redis, JWT)
├── entities/        # Entidades TypeORM (31 entidades)
├── modules/         # Módulos de la aplicación
│   ├── auth/        # Autenticación y autorización
│   ├── users/       # Gestión de usuarios
│   ├── buildings/   # Gestión de edificios
│   └── ...
└── main.ts         # Punto de entrada
```

## 🚀 Deployment

### Production Deployment
Este proyecto está configurado para deployment en **Render** con base de datos **Supabase**.

#### Quick Deploy
1. **Fork/Clone** el repositorio a tu cuenta de GitHub
2. **Configurar Supabase**:
   - Crear proyecto en [Supabase](https://supabase.com)
   - Copiar `DATABASE_URL` desde Settings > Database
3. **Deploy en Render**:
   - Conectar repositorio GitHub a [Render](https://render.com)
   - Usar `render.yaml` incluido para configuración automática
   - Configurar variables de entorno (ver DEPLOYMENT.md)

#### Variables de Entorno para Producción
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-secure-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret
REDIS_URL=redis://host:port
```

#### Pipeline CI/CD
- **GitHub Actions** ejecuta tests automáticamente en push/PR
- **Auto-deployment** a Render en branch main
- **Health checks** y monitoreo incluidos

📖 **Guía detallada de deployment**: Ver [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔐 Autenticación y Roles

### Roles del Sistema
- `SUPERADMIN` - Acceso total al sistema
- `ADMIN_OWNER` - Administrador de la administración
- `STAFF` - Personal de la administración
- `INSPECTOR` - Inspector técnico
- `VENDOR` - Proveedor de servicios
- `OWNER` - Propietario de unidad
- `TENANT` - Inquilino
- `READONLY` - Solo lectura

### Autenticación JWT
```bash
# Login
POST /api/v1/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}

# Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador Principal**: [@matiasjs](https://github.com/matiasjs)

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/matiasjs/consorcio-be/issues)
- **Documentación**: [Wiki](https://github.com/matiasjs/consorcio-be/wiki)
- **API Docs**: [Swagger UI](https://your-app.onrender.com/api/docs)
