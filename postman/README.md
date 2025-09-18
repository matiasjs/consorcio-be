# Postman Collections - Consorcios Backend RBAC

Este directorio contiene las colecciones de Postman para probar todos los endpoints del sistema de Consorcios Backend con RBAC.

## 📁 Archivos Incluidos

### 1. `Consorcios-Backend-RBAC.postman_collection.json`
**Colección principal** que incluye:
- 🔐 **Authentication** (Login, Refresh, Get Current User)
- 🔑 **RBAC Management** (Roles, Permissions, User Roles)
- 👥 **Users** (CRUD operations)
- 🏢 **Administrations** (CRUD operations)
- 🏗️ **Buildings** (CRUD operations)
- 🏠 **Units** (CRUD operations + Occupancy)
- 🎫 **Tickets** (CRUD operations + Inspector assignment)
- 🔧 **Vendors** (CRUD operations)

### 2. `Consorcios-Backend-Additional-Modules.postman_collection.json`
**Colección adicional** que incluye:
- 🔨 **Work Orders** (CRUD + Quotes, Schedules, Materials)
- 🧱 **Materials** (CRUD operations)
- 💰 **Invoices** (CRUD operations)
- 💳 **Payments** (CRUD operations)
- 🏗️ **Assets** (CRUD + Maintenance Plans)
- 🤝 **Meetings** (CRUD + Resolutions)
- 📄 **Documents** (CRUD operations)
- 🔔 **Notifications** (CRUD operations)
- 💬 **Messages** (Create, Get by Entity, Mark as Read)
- 🔍 **Inspections** (CRUD operations)
- 📊 **Subscriptions** (CRUD operations)
- 📈 **Usage Metrics** (Read operations)
- 📋 **Audit Logs** (Read operations)

## 🚀 Cómo Usar las Colecciones

### Paso 1: Importar en Postman
1. Abre Postman
2. Haz clic en **Import**
3. Selecciona los archivos `.json` de este directorio
4. Las colecciones aparecerán en tu workspace

### Paso 2: Configurar Variables
Las colecciones incluyen variables predefinidas:
- `base_url`: `http://localhost:3000/api/v1`
- `jwt_token`: Se establece automáticamente al hacer login

### Paso 3: Autenticación
1. **Ejecuta primero el endpoint "Login"** en la carpeta Authentication
2. El token JWT se guardará automáticamente en la variable `jwt_token`
3. Todos los demás endpoints usarán este token automáticamente

## 👤 Usuarios de Prueba Disponibles

### Admin (Acceso Completo)
```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```
**Permisos**: Todos (19 permisos)

### Secretaria (Acceso Operativo)
```json
{
  "email": "secretaria@demo.com",
  "password": "Admin123!"
}
```
**Permisos**: 12 permisos operativos (sin gestión de usuarios completa)

### Owner (Propietario)
```json
{
  "email": "owner@demo.com",
  "password": "Admin123!"
}
```
**Permisos**: 6 permisos de propietario

### Tenant (Inquilino)
```json
{
  "email": "tenant@demo.com",
  "password": "Admin123!"
}
```
**Permisos**: 4 permisos básicos de inquilino

## 🔐 Sistema de Permisos

### Permisos Disponibles
- `allUsers` - Gestión completa de usuarios
- `readUsers` - Lectura de usuarios
- `manageBuildings` - Gestión de edificios
- `manageUnits` - Gestión de unidades
- `managePeople` - Gestión de personas
- `readBilling` - Lectura de facturación
- `manageBilling` - Gestión de facturación
- `createWorkOrder` - Crear órdenes de trabajo
- `updateWorkOrder` - Actualizar órdenes de trabajo
- `readWorkOrder` - Leer órdenes de trabajo
- `closeWorkOrder` - Cerrar órdenes de trabajo
- `manageVendors` - Gestión de proveedores
- `manageDocuments` - Gestión de documentos
- `manageNotifications` - Gestión de notificaciones
- `readAuditLogs` - Lectura de logs de auditoría
- `manageRoles` - Gestión de roles
- `readRoles` - Lectura de roles
- `managePermissions` - Gestión de permisos
- `readPermissions` - Lectura de permisos

## 📝 Ejemplos de Uso

### 1. Flujo Básico de Autenticación
```
1. POST /auth/login (con credenciales de admin)
2. GET /auth/me (verificar perfil y permisos)
3. Usar cualquier endpoint protegido
```

### 2. Gestión de Usuarios (Solo Admin)
```
1. GET /users (listar usuarios)
2. POST /users (crear nuevo usuario)
3. POST /auth/users/:id/roles (asignar roles)
```

### 3. Gestión de Edificios
```
1. GET /buildings (listar edificios)
2. POST /buildings (crear edificio)
3. GET /units (listar unidades)
4. POST /units (crear unidad)
5. POST /units/:id/occupancy (asignar ocupante)
```

### 4. Flujo de Tickets y Work Orders
```
1. POST /tickets (crear ticket)
2. POST /workorders (crear orden de trabajo)
3. POST /workorders/:id/quotes (agregar cotización)
4. PATCH /workorders/:id (actualizar estado)
```

## 🛡️ Notas de Seguridad

- **Todos los endpoints están protegidos** con el sistema RBAC
- **Los permisos se verifican** en cada request
- **El token JWT incluye** los permisos del usuario
- **Multi-tenancy**: Los datos están aislados por `adminId`

## 🔧 Troubleshooting

### Error 401 (Unauthorized)
- Verifica que el token JWT esté configurado
- Ejecuta el login nuevamente

### Error 403 (Forbidden)
- El usuario no tiene los permisos necesarios
- Usa un usuario con más permisos (ej: admin)

### Error 404 (Not Found)
- Verifica que el servidor esté corriendo en `http://localhost:3000`
- Confirma que la URL del endpoint sea correcta

## 📊 Cobertura de Endpoints

**Total de endpoints cubiertos**: 109
- ✅ Authentication: 4 endpoints
- ✅ RBAC Management: 12 endpoints
- ✅ Core Modules: 93 endpoints

¡Las colecciones cubren **todos los endpoints** del sistema!
