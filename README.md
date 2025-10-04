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
- **🔐 Sistema RBAC con permisos granulares**
- **📊 Sistema de mensajería interno**
- **🤖 Asistente IA con LLM self-hosted (Qwen)**

## 🚀 Tecnologías

- **Backend**: NestJS + TypeScript
- **Base de datos**: PostgreSQL + TypeORM
- **Cache**: Redis
- **Autenticación**: JWT + Passport
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **IA/LLM**: Ollama + LiteLLM + Qwen 2.5
- **Deployment**: Docker + Render + Supabase

## 📊 Estado del Proyecto

### ✅ **COMPLETADO - 114/114 endpoints (100%)**

**Core Modules:**
- **Autenticación + RBAC** (12 endpoints): Login, refresh, me, roles, permissions, user-roles
- **Administraciones** (5 endpoints): CRUD completo
- **Usuarios** (5 endpoints): CRUD completo
- **Edificios** (5 endpoints): CRUD completo
- **Unidades** (7 endpoints): CRUD + occupancy
- **Proveedores** (9 endpoints): CRUD + availability
- **Tickets** (7 endpoints): CRUD + stats + inspector
- **Mensajes** (4 endpoints): Sistema de mensajería

**Business Modules:**
- **Inspecciones** (5 endpoints): Gestión completa
- **WorkOrders** (10 endpoints): Cotizaciones + programación
- **Materiales** (5 endpoints): Inventario
- **Facturas** (5 endpoints): Gestión de facturas
- **Pagos** (5 endpoints): Procesamiento de pagos
- **Assets** (7 endpoints): Gestión de activos
- **Reuniones** (7 endpoints): Reuniones + resoluciones
- **Documentos** (5 endpoints): Gestión documental

**System Modules:**
- **Notificaciones** (9 endpoints): Sistema completo
- **Suscripciones** (7 endpoints): Gestión de planes
- **Métricas** (8 endpoints): Estadísticas de uso
- **Auditoría** (10 endpoints): Logs del sistema
- **🤖 Asistente IA** (5 endpoints): Chat, herramientas, catálogo, salud

## 🔐 Sistema RBAC

### Roles Predefinidos
- **admin**: Acceso completo al sistema
- **secretaria**: Gestión operativa (edificios, unidades, tickets, proveedores)
- **owner**: Lectura de facturación y órdenes de trabajo propias
- **tenant**: Lectura de facturación y órdenes de trabajo propias
- **provider**: Gestión de órdenes de trabajo asignadas

### Permisos Granulares
- `allUsers`, `readUsers` - Gestión de usuarios
- `manageBuildings`, `manageUnits`, `managePeople` - Gestión inmobiliaria
- `readBilling`, `manageBilling` - Sistema financiero
- `createWorkOrder`, `updateWorkOrder`, `readWorkOrder`, `closeWorkOrder` - Órdenes de trabajo
- `manageVendors`, `manageDocuments`, `manageNotifications` - Gestión operativa
- `readAuditLogs` - Auditoría del sistema

### Usuarios de Prueba
```
admin@local.com / Admin123! (admin)
secretaria@demo.com / Admin123! (secretaria)
owner@demo.com / Admin123! (owner)
tenant@demo.com / Admin123! (tenant)
```

## 🤖 Asistente IA

### Características
- **LLM Self-hosted**: Qwen 2.5 via Ollama + LiteLLM
- **Tool Calling**: Operaciones CRUD automáticas
- **Dry-run vs Apply**: Vista previa segura antes de ejecutar
- **Permisos RBAC**: Solo ADMIN/SUPERADMIN pueden aplicar cambios
- **Idempotencia**: Previene ejecuciones duplicadas
- **Auditoría completa**: Logs de todas las interacciones
- **Catálogo automático**: Metadatos de entidades desde TypeORM

### Endpoints del Asistente
```
POST   /assistant              # Chat no-streaming
POST   /assistant/stream       # Chat con streaming (SSE)
GET    /assistant/health       # Estado del LLM
GET    /assistant/catalog      # Catálogo de entidades
POST   /assistant/tool/execute # Ejecutar herramientas
```

### Herramientas Disponibles
- **find**: Buscar registros con filtros complejos
- **create**: Crear nuevos registros
- **update**: Actualizar registros existentes
- **delete**: Eliminar registros (con confirmación)
- **runWorkflow**: Ejecutar flujos de trabajo personalizados

### Configuración
```bash
# Habilitar asistente
ASSISTANT_ENABLED=true
ASSISTANT_DEFAULT_MODE=dry-run

# LLM Configuration
LLM_API_BASE=http://llm-gateway:8000/v1
LLM_API_KEY=your-secure-key
LLM_MODEL=qwen2.5-instruct
```

### Uso Básico
```bash
# Chat simple
curl -X POST /assistant \
  -H "Authorization: Bearer $JWT" \
  -d '{"message": "Muestra todos los tickets abiertos"}'

# Ejecutar herramienta
curl -X POST /assistant/tool/execute \
  -H "Authorization: Bearer $JWT" \
  -H "x-idempotency-key: unique-key" \
  -d '{
    "toolCall": {
      "type": "find",
      "parameters": {"entity": "Ticket", "where": {"status": "open"}}
    },
    "mode": "dry-run"
  }'
```

Ver [LLM_SETUP.md](./LLM_SETUP.md) para configuración detallada.

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

5. **Configurar base de datos**
```bash
# Reset completo (desarrollo)
npm run db:drop
npm run db:create
npm run db:migrate
npm run db:seed

# Solo migraciones (producción)
npm run migration:run
npm run db:seed
```

6. **Configurar Asistente IA (Opcional)**
```bash
# Levantar servicios LLM
docker-compose --profile llm up -d

# Inicializar modelos
./scripts/init-llm.sh

# Habilitar en .env
ASSISTANT_ENABLED=true
```

7. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Desarrollo con IA
docker-compose --profile dev --profile llm up -d

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

# Tests del asistente IA
npm test -- --testNamePattern="Assistant"
npm test -- src/modules/assistant/test/
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
  "password": "Admin123!"
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
