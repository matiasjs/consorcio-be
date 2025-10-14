-- Script temporal para crear datos de prueba
-- Ejecutar este script en la base de datos PostgreSQL

-- Crear administración de prueba
INSERT INTO administrations (id, name, cuit, email, phone, address, "planTier", "isActive", "createdAt", "updatedAt")
VALUES (
  '9b97e349-7e9f-453a-856e-2a1509f93b29',
  'Administración de Prueba',
  '20-12345678-9',
  'admin@test.com',
  '+54 11 1234-5678',
  'Av. Corrientes 1234, Buenos Aires',
  'BASIC',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Crear roles básicos
INSERT INTO roles (id, name, description, "createdAt", "updatedAt")
VALUES
  (uuid_generate_v4(), 'SUPERADMIN', 'Super Administrator', NOW(), NOW()),
  (uuid_generate_v4(), 'ADMIN', 'Administrator', NOW(), NOW()),
  (uuid_generate_v4(), 'STAFF', 'Staff Member', NOW(), NOW()),
  (uuid_generate_v4(), 'OWNER', 'Property Owner', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Crear usuario de prueba (password: admin123)
-- Hash generado con bcrypt para 'admin123'
INSERT INTO users (id, "adminId", email, "passwordHash", "fullName", status, "createdAt", "updatedAt")
VALUES (
  '9b97e349-7e9f-453a-856e-2a1509f93b29',
  '9b97e349-7e9f-453a-856e-2a1509f93b29',
  'admin@test.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrador de Prueba',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (email, "adminId") DO NOTHING;

-- Asignar rol ADMIN al usuario
INSERT INTO user_roles ("userId", "roleId")
SELECT
  '9b97e349-7e9f-453a-856e-2a1509f93b29',
  r.id
FROM roles r
WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;
