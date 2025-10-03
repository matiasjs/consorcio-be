/**
 * Test data for unit tests
 */

export const testAdministration = {
  id: 'test-admin-id',
  name: 'Test Administration',
  cuit: '20-12345678-9',
  email: 'test@admin.com',
  phone: '+54 11 1234-5678',
  address: 'Test Address 123',
  planTier: 'BASIC',
  isActive: true,
}

export const testSuperAdmin = {
  id: 'test-superadmin-id',
  email: 'superadmin@test.com',
  fullName: 'Super Admin Test',
  status: 'ACTIVE',
  adminId: testAdministration.id,
  roles: [{ name: 'SUPERADMIN', description: 'Super Administrator' }],
}

export const testAdminOwner = {
  id: 'test-admin-owner-id',
  email: 'admin@test.com',
  fullName: 'Admin Owner Test',
  status: 'ACTIVE',
  adminId: testAdministration.id,
  roles: [{ name: 'ADMIN', description: 'Administrator' }],
}

export const testStaff = {
  id: 'test-staff-id',
  email: 'staff@test.com',
  fullName: 'Staff Test',
  status: 'ACTIVE',
  adminId: testAdministration.id,
  roles: [{ name: 'STAFF', description: 'Staff Member' }],
}

export const testOwner = {
  id: 'test-owner-id',
  email: 'owner@test.com',
  fullName: 'Owner Test',
  status: 'ACTIVE',
  adminId: testAdministration.id,
  roles: [{ name: 'OWNER', description: 'Property Owner' }],
}

export const testBuilding = {
  id: 'test-building-id',
  name: 'Test Building',
  address: 'Test Building Address 456',
  floors: 10,
  units: 20,
  adminId: testAdministration.id,
  status: 'ACTIVE',
}

export const testUnit = {
  id: 'test-unit-id',
  number: '101',
  floor: 1,
  type: 'APARTMENT',
  size: 75.5,
  buildingId: testBuilding.id,
  adminId: testAdministration.id,
  status: 'OCCUPIED',
}

export const testTicket = {
  id: 'test-ticket-id',
  title: 'Test Ticket',
  description: 'Test ticket description',
  status: 'OPEN',
  priority: 'MEDIUM',
  category: 'MAINTENANCE',
  buildingId: testBuilding.id,
  unitId: testUnit.id,
  reportedById: testOwner.id,
  adminId: testAdministration.id,
}

export const testVendor = {
  id: 'test-vendor-id',
  name: 'Test Vendor',
  email: 'vendor@test.com',
  phone: '+54 11 9876-5432',
  category: 'MAINTENANCE',
  status: 'ACTIVE',
  adminId: testAdministration.id,
}

export const testWorkOrder = {
  id: 'test-workorder-id',
  title: 'Test Work Order',
  description: 'Test work order description',
  status: 'PENDING',
  priority: 'HIGH',
  category: 'MAINTENANCE',
  buildingId: testBuilding.id,
  unitId: testUnit.id,
  assignedToId: testVendor.id,
  requestedById: testOwner.id,
  adminId: testAdministration.id,
}

export const testInvoice = {
  id: 'test-invoice-id',
  number: 'INV-001',
  amount: 1500.00,
  dueDate: new Date('2024-12-31'),
  status: 'PENDING',
  type: 'MONTHLY_FEE',
  buildingId: testBuilding.id,
  unitId: testUnit.id,
  adminId: testAdministration.id,
}

export const testPayment = {
  id: 'test-payment-id',
  amount: 1500.00,
  paymentDate: new Date(),
  method: 'BANK_TRANSFER',
  status: 'COMPLETED',
  invoiceId: testInvoice.id,
  adminId: testAdministration.id,
}

export const testMeeting = {
  id: 'test-meeting-id',
  title: 'Test Meeting',
  description: 'Test meeting description',
  date: new Date('2024-12-15'),
  status: 'SCHEDULED',
  type: 'ORDINARY',
  buildingId: testBuilding.id,
  adminId: testAdministration.id,
}

export const testDocument = {
  id: 'test-document-id',
  title: 'Test Document',
  description: 'Test document description',
  type: 'CONTRACT',
  fileName: 'test-document.pdf',
  fileSize: 1024,
  mimeType: 'application/pdf',
  buildingId: testBuilding.id,
  adminId: testAdministration.id,
}

export const testInspection = {
  id: 'test-inspection-id',
  title: 'Test Inspection',
  description: 'Test inspection description',
  date: new Date(),
  status: 'COMPLETED',
  type: 'SAFETY',
  buildingId: testBuilding.id,
  inspectorId: testStaff.id,
  adminId: testAdministration.id,
}

export const testAsset = {
  id: 'test-asset-id',
  name: 'Test Asset',
  description: 'Test asset description',
  category: 'EQUIPMENT',
  status: 'ACTIVE',
  purchaseDate: new Date('2023-01-01'),
  purchasePrice: 5000.00,
  buildingId: testBuilding.id,
  adminId: testAdministration.id,
}

export const testMaterial = {
  id: 'test-material-id',
  name: 'Test Material',
  description: 'Test material description',
  category: 'PLUMBING',
  unit: 'UNIT',
  currentStock: 10,
  minStock: 5,
  unitPrice: 25.50,
  adminId: testAdministration.id,
}
