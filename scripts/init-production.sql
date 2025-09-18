-- Production initialization script for Consorcios Backend
-- This script creates initial data for production environment

-- Create initial administration
INSERT INTO administrations (id, name, cuit, email, phone, address, plan_tier, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Administración Demo',
  '20-12345678-9',
  'admin@consorcios-demo.com',
  '+54 11 1234-5678',
  'Av. Corrientes 1234, CABA, Argentina',
  'BASIC',
  true,
  NOW(),
  NOW()
) ON CONFLICT (cuit) DO NOTHING;

-- Create super admin user
INSERT INTO users (id, admin_id, email, phone, password_hash, full_name, roles, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  a.id,
  'superadmin@consorcios-demo.com',
  '+54 11 1234-5678',
  '$2b$10$xUocTEOkBJaGhpOtjVcczelWmEtjgDFDGPa9oo92ENAXX05rAZNV2', -- password: password123
  'Super Administrador',
  ARRAY['SUPERADMIN']::user_role_enum[],
  'ACTIVE'::user_status_enum,
  NOW(),
  NOW()
FROM administrations a 
WHERE a.cuit = '20-12345678-9'
ON CONFLICT (email) DO NOTHING;

-- Create admin owner user
INSERT INTO users (id, admin_id, email, phone, password_hash, full_name, roles, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  a.id,
  'admin@consorcios-demo.com',
  '+54 11 1234-5679',
  '$2b$10$xUocTEOkBJaGhpOtjVcczelWmEtjgDFDGPa9oo92ENAXX05rAZNV2', -- password: password123
  'Administrador Principal',
  ARRAY['ADMIN_OWNER']::user_role_enum[],
  'ACTIVE'::user_status_enum,
  NOW(),
  NOW()
FROM administrations a 
WHERE a.cuit = '20-12345678-9'
ON CONFLICT (email) DO NOTHING;

-- Create demo building
INSERT INTO buildings (id, admin_id, name, address, city, country, total_floors, total_units, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  a.id,
  'Torre Demo',
  'Av. Santa Fe 1234',
  'Buenos Aires',
  'Argentina',
  10,
  40,
  NOW(),
  NOW()
FROM administrations a 
WHERE a.cuit = '20-12345678-9'
ON CONFLICT DO NOTHING;

-- Create demo units
INSERT INTO units (id, building_id, label, type, floor, m2, is_rented, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  b.id,
  '1A',
  'APARTMENT'::unit_type_enum,
  1,
  85.5,
  false,
  NOW(),
  NOW()
FROM buildings b 
WHERE b.name = 'Torre Demo'
ON CONFLICT DO NOTHING;

INSERT INTO units (id, building_id, label, type, floor, m2, is_rented, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  b.id,
  '1B',
  'APARTMENT'::unit_type_enum,
  1,
  92.0,
  true,
  NOW(),
  NOW()
FROM buildings b 
WHERE b.name = 'Torre Demo'
ON CONFLICT DO NOTHING;

-- Create demo vendor
INSERT INTO vendors (id, admin_id, legal_name, trade, email, phone, whatsapp, rating_avg, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  a.id,
  'Plomería Rodríguez S.A.',
  'plumbing',
  'contacto@plomeriarodriguez.com',
  '+54 11 9876-5432',
  '+54 11 9876-5432',
  4.5,
  NOW(),
  NOW()
FROM administrations a 
WHERE a.cuit = '20-12345678-9'
ON CONFLICT DO NOTHING;

-- Add vendor availability
INSERT INTO vendor_availabilities (id, vendor_id, weekday, "from", "to", created_at, updated_at)
SELECT 
  gen_random_uuid(),
  v.id,
  'monday'::weekday_enum,
  '09:00',
  '17:00',
  NOW(),
  NOW()
FROM vendors v 
WHERE v.legal_name = 'Plomería Rodríguez S.A.'
ON CONFLICT DO NOTHING;

INSERT INTO vendor_availabilities (id, vendor_id, weekday, "from", "to", created_at, updated_at)
SELECT 
  gen_random_uuid(),
  v.id,
  'tuesday'::weekday_enum,
  '09:00',
  '17:00',
  NOW(),
  NOW()
FROM vendors v 
WHERE v.legal_name = 'Plomería Rodríguez S.A.'
ON CONFLICT DO NOTHING;

-- Create demo ticket
INSERT INTO tickets (id, admin_id, building_id, unit_id, created_by_user_id, type, channel, title, description, priority, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  a.id,
  b.id,
  u.id,
  usr.id,
  'MAINTENANCE'::ticket_type_enum,
  'WEB'::ticket_channel_enum,
  'Pérdida de agua en baño',
  'Se detectó una pérdida de agua en el baño principal del departamento. Requiere atención urgente.',
  'HIGH'::ticket_priority_enum,
  'OPEN'::ticket_status_enum,
  NOW(),
  NOW()
FROM administrations a
CROSS JOIN buildings b
CROSS JOIN units u
CROSS JOIN users usr
WHERE a.cuit = '20-12345678-9'
  AND b.name = 'Torre Demo'
  AND u.label = '1A'
  AND usr.email = 'admin@consorcios-demo.com'
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Production initialization completed successfully!' as message;
