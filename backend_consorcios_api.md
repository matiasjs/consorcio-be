# Prompt Augment — Consorcios Backend API

## Entidades base de datos

### Administración
- Administration: id, name, cuit, email, phone, address, plan_tier, is_active
- Building: id, admin_id*, name, address, city, country
- Unit: id, building_id*, label, type (apartment|store|garage), floor, m2, is_rented

### Personas
- User: id, admin_id*, email, phone, password_hash, full_name, roles[], status
- OwnerProfile: id, user_id*
- TenantProfile: id, user_id*
- UnitOccupancy: id, unit_id*, owner_user_id, tenant_user_id, start_date, end_date
- StaffProfile: id, user_id*, position
- Vendor: id, admin_id*, legal_name, trade, email, phone, whatsapp, rating_avg
- VendorAvailability: id, vendor_id*, weekday, from, to

### Reclamos / trabajos
- Ticket: id, admin_id*, building_id*, unit_id?, created_by_user_id*, type, status, priority
- Inspection: id, ticket_id*, inspector_user_id*, scheduled_at, notes, photos[]
- WorkOrder: id, ticket_id*, vendor_id*, status, scheduled_at, before_photos[], after_photos[]
- Quote: id, work_order_id*, vendor_id*, amount_subtotal, materials_estimate, taxes, total
- ScheduleSlot: id, work_order_id*, start, end, status
- Message: id, entity_type, entity_id*, author_user_id?, direction, channel, body

### Materiales / facturación
- MaterialItem: id, name, unit, default_cost?
- WorkOrderMaterial: id, work_order_id*, material_item_id*, qty, unit_cost?
- VendorInvoice: id, work_order_id*, vendor_id*, number, issue_date, subtotal, taxes, total, status
- Payment: id, vendor_invoice_id*, method, scheduled_for?, paid_at?, amount, status

### Mantenimiento preventivo
- Asset: id, building_id*, name, type, serial?, install_date?
- MaintenancePlan: id, asset_id*, frequency, task_list[]
- MaintenanceTask: id, plan_id*, scheduled_for, status, notes, evidence_photos[]

### Reuniones
- Meeting: id, admin_id*, building_id*, title, scheduled_at, agenda[]
- Resolution: id, meeting_id*, title, description, requires_vote, status
- Vote: id, resolution_id*, unit_id*, choice, weight

### Documentos / notificaciones
- Document: id, admin_id*, building_id?, unit_id?, type, title, file_url
- Notification: id, user_id*, title, body, channel, status

### Suscripciones / auditoría
- Subscription: id, admin_id*, plan, units_quota, price_month, renews_at, status
- UsageMetric: id, admin_id*, metric, period, value
- AuditLog: id, admin_id*, actor_user_id?, action, entity, entity_id, diff, ip

---

## Endpoints a generar (REST v1)

### Auth & usuarios
- POST /v1/auth/login
- POST /v1/auth/refresh
- GET /v1/me
- CRUD /v1/users

### Administración / edificios
- CRUD /v1/administrations
- CRUD /v1/buildings
- CRUD /v1/units
- POST /v1/units/:id/occupancy
- GET /v1/units/:id/occupancy

### Vendors
- CRUD /v1/vendors
- CRUD /v1/vendors/:id/availability

### Tickets / inspecciones / órdenes
- CRUD /v1/tickets
- POST /v1/tickets/:id/assign-inspector
- CRUD /v1/inspections
- CRUD /v1/workorders
- CRUD /v1/workorders/:id/quotes
- POST /v1/workorders/:id/schedules
- POST /v1/tickets/:id/messages

### Materiales / facturas / pagos
- CRUD /v1/materials
- CRUD /v1/workorders/:id/materials
- CRUD /v1/invoices
- CRUD /v1/payments

### Mantenimiento preventivo
- CRUD /v1/assets
- CRUD /v1/assets/:id/plans
- CRUD /v1/plans/:id/tasks

### Reuniones
- CRUD /v1/meetings
- CRUD /v1/meetings/:id/resolutions
- POST /v1/resolutions/:id/votes

### Documentos / notificaciones
- CRUD /v1/documents
- CRUD /v1/notifications

### Suscripciones / métricas
- CRUD /v1/subscriptions
- GET /v1/usage-metrics

### Auditoría
- GET /v1/audit-logs
