# 🚀 Quick Start - Postman Collections

## 📥 Importación Rápida

### Opción 1: Colección Completa (Recomendado)
```
Archivo: Consorcios-Backend-Complete.postman_collection.json
Endpoints: 119 endpoints organizados en 23 categorías
```

### Opción 2: Colecciones Separadas
```
1. Consorcios-Backend-RBAC.postman_collection.json (Módulos principales)
2. Consorcios-Backend-Additional-Modules.postman_collection.json (Módulos adicionales)
```

## ⚡ Configuración en 3 Pasos

### 1. Importar en Postman
- Abre Postman
- Clic en **Import**
- Arrastra el archivo `Consorcios-Backend-Complete.postman_collection.json`

### 2. Login Automático
- Ve a la carpeta **Authentication**
- Ejecuta **Login** con estas credenciales:
```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```
- El token se guarda automáticamente ✅

### 3. ¡Listo para Probar!
- Todos los endpoints están configurados
- El token JWT se aplica automáticamente
- Variables predefinidas funcionando

## 🎯 Endpoints Más Importantes

### 🔐 Autenticación
- `POST /auth/login` - Login (ejecutar primero)
- `GET /auth/me` - Ver perfil y permisos

### 👥 Gestión de Usuarios
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `POST /auth/users/:id/roles` - Asignar roles

### 🏗️ Gestión de Edificios
- `GET /buildings` - Listar edificios
- `POST /buildings` - Crear edificio
- `GET /units` - Listar unidades

### 🎫 Tickets y Órdenes de Trabajo
- `POST /tickets` - Crear ticket
- `POST /workorders` - Crear orden de trabajo
- `GET /tickets/stats` - Estadísticas

## 👤 Usuarios de Prueba

| Usuario | Email | Password | Permisos |
|---------|-------|----------|----------|
| **Admin** | admin@demo.com | Admin123! | Todos (19) |
| **Secretaria** | secretaria@demo.com | Admin123! | Operativos (12) |
| **Owner** | owner@demo.com | Admin123! | Propietario (6) |
| **Tenant** | tenant@demo.com | Admin123! | Inquilino (4) |

## 🔧 Variables Configuradas

- `{{base_url}}` = `http://localhost:3000/api/v1`
- `{{jwt_token}}` = Se establece automáticamente al hacer login

## ✅ Verificación Rápida

1. **Login exitoso**: Deberías recibir un `access_token`
2. **Token guardado**: La variable `jwt_token` se llena automáticamente
3. **Endpoint protegido**: `GET /users` debería funcionar sin configurar headers

## 🚨 Troubleshooting

### Error 401
- Ejecuta el login nuevamente
- Verifica que el servidor esté corriendo

### Error 403
- El usuario no tiene permisos
- Usa admin@demo.com para acceso completo

### Error 404
- Verifica que el servidor esté en `http://localhost:3000`
- Confirma que la base de datos esté migrada

## 📊 Cobertura Total

✅ **119 endpoints** cubiertos
✅ **23 módulos** organizados
✅ **RBAC completo** implementado
✅ **Multi-tenancy** configurado
✅ **Autenticación automática** configurada

## 🎉 ¡Todo Listo!

Con estas colecciones puedes probar **todo el sistema** de Consorcios Backend:
- Sistema RBAC completo
- Gestión de usuarios, edificios, unidades
- Tickets, órdenes de trabajo, proveedores
- Facturación, pagos, activos
- Reuniones, documentos, notificaciones
- Métricas de uso y logs de auditoría

**¡Disfruta probando el sistema!** 🚀
