/**
 * Script para generar una colección completa de Postman con todos los 109 endpoints
 * Ejecutar con: node generate-complete-collection.js
 */

const fs = require('fs');
const path = require('path');

// Definición completa de todos los endpoints
const endpoints = {
  "Authentication": [
    { method: "POST", path: "/auth/login", name: "Login", description: "User login" },
    { method: "POST", path: "/auth/refresh", name: "Refresh Token", description: "Refresh token" },
    { method: "GET", path: "/auth/me", name: "Get Current User", description: "Get current user" }
  ],
  "RBAC Management": [
    { method: "GET", path: "/auth/roles", name: "Get All Roles", description: "Get all roles" },
    { method: "POST", path: "/auth/roles", name: "Create Role", description: "Create new role" },
    { method: "GET", path: "/auth/roles/:id", name: "Get Role by ID", description: "Get role by ID" },
    { method: "PATCH", path: "/auth/roles/:id", name: "Update Role", description: "Update role" },
    { method: "DELETE", path: "/auth/roles/:id", name: "Delete Role", description: "Delete role" },
    { method: "POST", path: "/auth/roles/:id/permissions", name: "Assign Permissions", description: "Assign permissions to role" },
    { method: "GET", path: "/auth/permissions", name: "Get All Permissions", description: "Get all permissions" },
    { method: "POST", path: "/auth/permissions", name: "Create Permission", description: "Create new permission" },
    { method: "POST", path: "/auth/users/:id/roles", name: "Assign User Roles", description: "Assign roles to user" },
    { method: "GET", path: "/auth/users/:id/roles", name: "Get User Roles", description: "Get user roles" }
  ],
  "Users": [
    { method: "GET", path: "/users", name: "Get All Users", description: "Get all users" },
    { method: "POST", path: "/users", name: "Create User", description: "Create user" },
    { method: "GET", path: "/users/:id", name: "Get User by ID", description: "Get user by ID" },
    { method: "PATCH", path: "/users/:id", name: "Update User", description: "Update user" },
    { method: "DELETE", path: "/users/:id", name: "Delete User", description: "Delete user" }
  ],
  "Administrations": [
    { method: "GET", path: "/administrations", name: "Get All Administrations", description: "Get all administrations" },
    { method: "POST", path: "/administrations", name: "Create Administration", description: "Create administration" },
    { method: "GET", path: "/administrations/:id", name: "Get Administration by ID", description: "Get administration by ID" },
    { method: "PATCH", path: "/administrations/:id", name: "Update Administration", description: "Update administration" },
    { method: "DELETE", path: "/administrations/:id", name: "Delete Administration", description: "Delete administration" }
  ],
  "Buildings": [
    { method: "GET", path: "/buildings", name: "Get All Buildings", description: "Get all buildings" },
    { method: "POST", path: "/buildings", name: "Create Building", description: "Create building" },
    { method: "GET", path: "/buildings/:id", name: "Get Building by ID", description: "Get building by ID" },
    { method: "PATCH", path: "/buildings/:id", name: "Update Building", description: "Update building" },
    { method: "DELETE", path: "/buildings/:id", name: "Delete Building", description: "Delete building" }
  ],
  "Units": [
    { method: "GET", path: "/units", name: "Get All Units", description: "Get all units" },
    { method: "POST", path: "/units", name: "Create Unit", description: "Create unit" },
    { method: "GET", path: "/units/:id", name: "Get Unit by ID", description: "Get unit by ID" },
    { method: "PATCH", path: "/units/:id", name: "Update Unit", description: "Update unit" },
    { method: "DELETE", path: "/units/:id", name: "Delete Unit", description: "Delete unit" },
    { method: "POST", path: "/units/:id/occupancy", name: "Create Unit Occupancy", description: "Create unit occupancy" },
    { method: "GET", path: "/units/:id/occupancy", name: "Get Unit Occupancy", description: "Get unit occupancy" }
  ],
  "Vendors": [
    { method: "GET", path: "/vendors", name: "Get All Vendors", description: "Get all vendors" },
    { method: "POST", path: "/vendors", name: "Create Vendor", description: "Create vendor" },
    { method: "GET", path: "/vendors/:id", name: "Get Vendor by ID", description: "Get vendor by ID" },
    { method: "PATCH", path: "/vendors/:id", name: "Update Vendor", description: "Update vendor" },
    { method: "DELETE", path: "/vendors/:id", name: "Delete Vendor", description: "Delete vendor" },
    { method: "GET", path: "/vendors/:id/availability", name: "Get Vendor Availability", description: "Get vendor availability" },
    { method: "POST", path: "/vendors/:id/availability", name: "Create Vendor Availability", description: "Create vendor availability" },
    { method: "PATCH", path: "/vendors/:id/availability/:availabilityId", name: "Update Vendor Availability", description: "Update vendor availability" },
    { method: "DELETE", path: "/vendors/:id/availability/:availabilityId", name: "Delete Vendor Availability", description: "Delete vendor availability" }
  ],
  "Tickets": [
    { method: "GET", path: "/tickets", name: "Get All Tickets", description: "Get all tickets" },
    { method: "POST", path: "/tickets", name: "Create Ticket", description: "Create ticket" },
    { method: "GET", path: "/tickets/stats", name: "Get Ticket Stats", description: "Get ticket stats" },
    { method: "GET", path: "/tickets/:id", name: "Get Ticket by ID", description: "Get ticket by ID" },
    { method: "PATCH", path: "/tickets/:id", name: "Update Ticket", description: "Update ticket" },
    { method: "DELETE", path: "/tickets/:id", name: "Delete Ticket", description: "Delete ticket" },
    { method: "POST", path: "/tickets/:id/assign-inspector", name: "Assign Inspector", description: "Assign inspector to ticket" }
  ],
  "Inspections": [
    { method: "GET", path: "/inspections", name: "Get All Inspections", description: "Get all inspections" },
    { method: "POST", path: "/inspections", name: "Create Inspection", description: "Create inspection" },
    { method: "GET", path: "/inspections/:id", name: "Get Inspection by ID", description: "Get inspection by ID" },
    { method: "PATCH", path: "/inspections/:id", name: "Update Inspection", description: "Update inspection" },
    { method: "DELETE", path: "/inspections/:id", name: "Delete Inspection", description: "Delete inspection" }
  ],
  "Work Orders": [
    { method: "GET", path: "/workorders", name: "Get All Work Orders", description: "Get all work orders" },
    { method: "POST", path: "/workorders", name: "Create Work Order", description: "Create work order" },
    { method: "GET", path: "/workorders/:id", name: "Get Work Order by ID", description: "Get work order by ID" },
    { method: "PATCH", path: "/workorders/:id", name: "Update Work Order", description: "Update work order" },
    { method: "DELETE", path: "/workorders/:id", name: "Delete Work Order", description: "Delete work order" },
    { method: "GET", path: "/workorders/:id/quotes", name: "Get Work Order Quotes", description: "Get work order quotes" },
    { method: "POST", path: "/workorders/:id/quotes", name: "Create Work Order Quote", description: "Create work order quote" },
    { method: "POST", path: "/workorders/:id/schedules", name: "Create Work Order Schedule", description: "Create work order schedule" },
    { method: "GET", path: "/workorders/:id/materials", name: "Get Work Order Materials", description: "Get work order materials" },
    { method: "POST", path: "/workorders/:id/materials", name: "Add Material to Work Order", description: "Add material to work order" }
  ],
  "Materials": [
    { method: "GET", path: "/materials", name: "Get All Materials", description: "Get all materials" },
    { method: "POST", path: "/materials", name: "Create Material", description: "Create material" },
    { method: "GET", path: "/materials/:id", name: "Get Material by ID", description: "Get material by ID" },
    { method: "PATCH", path: "/materials/:id", name: "Update Material", description: "Update material" },
    { method: "DELETE", path: "/materials/:id", name: "Delete Material", description: "Delete material" }
  ],
  "Invoices": [
    { method: "GET", path: "/invoices", name: "Get All Invoices", description: "Get all invoices" },
    { method: "POST", path: "/invoices", name: "Create Invoice", description: "Create invoice" },
    { method: "GET", path: "/invoices/:id", name: "Get Invoice by ID", description: "Get invoice by ID" },
    { method: "PATCH", path: "/invoices/:id", name: "Update Invoice", description: "Update invoice" },
    { method: "DELETE", path: "/invoices/:id", name: "Delete Invoice", description: "Delete invoice" }
  ],
  "Payments": [
    { method: "GET", path: "/payments", name: "Get All Payments", description: "Get all payments" },
    { method: "POST", path: "/payments", name: "Create Payment", description: "Create payment" },
    { method: "GET", path: "/payments/:id", name: "Get Payment by ID", description: "Get payment by ID" },
    { method: "PATCH", path: "/payments/:id", name: "Update Payment", description: "Update payment" },
    { method: "DELETE", path: "/payments/:id", name: "Delete Payment", description: "Delete payment" }
  ],
  "Assets": [
    { method: "GET", path: "/assets", name: "Get All Assets", description: "Get all assets" },
    { method: "POST", path: "/assets", name: "Create Asset", description: "Create asset" },
    { method: "GET", path: "/assets/:id", name: "Get Asset by ID", description: "Get asset by ID" },
    { method: "PATCH", path: "/assets/:id", name: "Update Asset", description: "Update asset" },
    { method: "DELETE", path: "/assets/:id", name: "Delete Asset", description: "Delete asset" },
    { method: "GET", path: "/assets/:id/plans", name: "Get Asset Maintenance Plans", description: "Get asset maintenance plans" },
    { method: "POST", path: "/assets/:id/plans", name: "Create Asset Maintenance Plan", description: "Create asset maintenance plan" }
  ],
  "Plans": [
    { method: "GET", path: "/plans/:id/tasks", name: "Get Maintenance Plan Tasks", description: "Get maintenance plan tasks" },
    { method: "POST", path: "/plans/:id/tasks", name: "Create Maintenance Task", description: "Create maintenance task" }
  ],
  "Meetings": [
    { method: "GET", path: "/meetings", name: "Get All Meetings", description: "Get all meetings" },
    { method: "POST", path: "/meetings", name: "Create Meeting", description: "Create meeting" },
    { method: "GET", path: "/meetings/:id", name: "Get Meeting by ID", description: "Get meeting by ID" },
    { method: "PATCH", path: "/meetings/:id", name: "Update Meeting", description: "Update meeting" },
    { method: "DELETE", path: "/meetings/:id", name: "Delete Meeting", description: "Delete meeting" },
    { method: "GET", path: "/meetings/:id/resolutions", name: "Get Meeting Resolutions", description: "Get meeting resolutions" },
    { method: "POST", path: "/meetings/:id/resolutions", name: "Create Meeting Resolution", description: "Create meeting resolution" }
  ],
  "Resolutions": [
    { method: "POST", path: "/resolutions/:id/votes", name: "Vote on Resolution", description: "Vote on resolution" }
  ],
  "Documents": [
    { method: "GET", path: "/documents", name: "Get All Documents", description: "Get all documents" },
    { method: "POST", path: "/documents", name: "Create Document", description: "Create document" },
    { method: "GET", path: "/documents/:id", name: "Get Document by ID", description: "Get document by ID" },
    { method: "PATCH", path: "/documents/:id", name: "Update Document", description: "Update document" },
    { method: "DELETE", path: "/documents/:id", name: "Delete Document", description: "Delete document" }
  ],
  "Notifications": [
    { method: "GET", path: "/notifications", name: "Get All Notifications", description: "Get all notifications" },
    { method: "POST", path: "/notifications", name: "Create Notification", description: "Create notification" },
    { method: "GET", path: "/notifications/:id", name: "Get Notification by ID", description: "Get notification by ID" },
    { method: "PATCH", path: "/notifications/:id", name: "Update Notification", description: "Update notification" },
    { method: "DELETE", path: "/notifications/:id", name: "Delete Notification", description: "Delete notification" }
  ],
  "Subscriptions": [
    { method: "GET", path: "/subscriptions", name: "Get All Subscriptions", description: "Get all subscriptions" },
    { method: "POST", path: "/subscriptions", name: "Create Subscription", description: "Create subscription" },
    { method: "GET", path: "/subscriptions/:id", name: "Get Subscription by ID", description: "Get subscription by ID" },
    { method: "PATCH", path: "/subscriptions/:id", name: "Update Subscription", description: "Update subscription" },
    { method: "DELETE", path: "/subscriptions/:id", name: "Delete Subscription", description: "Delete subscription" }
  ],
  "Usage Metrics": [
    { method: "GET", path: "/usage-metrics", name: "Get Usage Metrics", description: "Get usage metrics" }
  ],
  "Audit Logs": [
    { method: "GET", path: "/audit-logs", name: "Get Audit Logs", description: "Get audit logs" }
  ],
  "Messages": [
    { method: "POST", path: "/messages", name: "Create Message", description: "Create message" },
    { method: "GET", path: "/messages/entity/:entityType/:entityId", name: "Get Messages for Entity", description: "Get messages for entity" },
    { method: "GET", path: "/messages/entity/:entityType/:entityId/unread-count", name: "Get Unread Count", description: "Get unread count" },
    { method: "PATCH", path: "/messages/:id/mark-read", name: "Mark Message as Read", description: "Mark message as read" }
  ]
};

// Función para generar un endpoint de Postman
function generateEndpoint(endpoint, category) {
  const item = {
    name: endpoint.name,
    request: {
      method: endpoint.method,
      header: [],
      url: {
        raw: `{{base_url}}${endpoint.path}`,
        host: ["{{base_url}}"],
        path: endpoint.path.split('/').filter(p => p)
      }
    }
  };

  if (endpoint.description) {
    item.request.description = endpoint.description;
  }

  // Agregar Content-Type para métodos que envían datos
  if (['POST', 'PATCH', 'PUT'].includes(endpoint.method)) {
    item.request.header.push({
      key: "Content-Type",
      value: "application/json"
    });
    
    // Agregar body de ejemplo
    item.request.body = {
      mode: "raw",
      raw: generateSampleBody(endpoint.path, endpoint.method)
    };
  }

  // Agregar variables de path si existen
  const pathVariables = endpoint.path.match(/:(\w+)/g);
  if (pathVariables) {
    item.request.url.variable = pathVariables.map(variable => ({
      key: variable.substring(1),
      value: `${variable.substring(1)}_here`
    }));
  }

  return item;
}

// Función para generar body de ejemplo
function generateSampleBody(path, method) {
  if (method === 'GET' || method === 'DELETE') return '';
  
  // Ejemplos básicos basados en el path
  if (path.includes('/users')) {
    return '{\n  "email": "user@example.com",\n  "firstName": "John",\n  "lastName": "Doe",\n  "password": "Password123!"\n}';
  }
  if (path.includes('/buildings')) {
    return '{\n  "name": "Building Name",\n  "address": "123 Main St",\n  "floors": 10\n}';
  }
  if (path.includes('/login')) {
    return '{\n  "email": "admin@demo.com",\n  "password": "Admin123!"\n}';
  }
  
  return '{\n  "name": "Sample Name",\n  "description": "Sample Description"\n}';
}

// Generar la colección completa
const collection = {
  info: {
    _postman_id: "consorcios-complete-collection",
    name: "Consorcios Backend - Complete Collection (109 Endpoints)",
    description: "Complete collection with all 109 endpoints of the Consorcios Backend RBAC system",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{jwt_token}}",
        type: "string"
      }
    ]
  },
  variable: [
    {
      key: "base_url",
      value: "http://localhost:3000/api/v1",
      type: "string"
    },
    {
      key: "jwt_token",
      value: "",
      type: "string"
    }
  ],
  item: []
};

// Generar todas las carpetas y endpoints
Object.entries(endpoints).forEach(([category, categoryEndpoints]) => {
  const categoryItem = {
    name: category,
    item: categoryEndpoints.map(endpoint => generateEndpoint(endpoint, category))
  };
  collection.item.push(categoryItem);
});

// Guardar la colección
const outputPath = path.join(__dirname, 'Consorcios-Backend-Complete.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log(`✅ Colección completa generada: ${outputPath}`);
console.log(`📊 Total de endpoints: ${Object.values(endpoints).flat().length}`);
console.log(`📁 Total de categorías: ${Object.keys(endpoints).length}`);
