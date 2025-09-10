"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorInvoice = exports.InvoiceStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const payment_entity_1 = require("./payment.entity");
const vendor_entity_1 = require("./vendor.entity");
const work_order_entity_1 = require("./work-order.entity");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "DRAFT";
    InvoiceStatus["SUBMITTED"] = "SUBMITTED";
    InvoiceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    InvoiceStatus["APPROVED"] = "APPROVED";
    InvoiceStatus["REJECTED"] = "REJECTED";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    InvoiceStatus["OVERDUE"] = "OVERDUE";
    InvoiceStatus["CANCELLED"] = "CANCELLED";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
let VendorInvoice = class VendorInvoice extends base_entity_1.BaseEntity {
    adminId;
    workOrderId;
    vendorId;
    number;
    issueDate;
    dueDate;
    amountSubtotal;
    materialsAmount;
    laborAmount;
    taxes;
    total;
    currency;
    status;
    files;
    description;
    lineItems;
    notes;
    purchaseOrderNumber;
    taxRate;
    paymentTerms;
    submittedAt;
    approvedAt;
    approvedByUserId;
    rejectionReason;
    paidAmount;
    remainingAmount;
    workOrder;
    vendor;
    payments;
};
exports.VendorInvoice = VendorInvoice;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], VendorInvoice.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], VendorInvoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "amountSubtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "materialsAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "laborAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "taxes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.DRAFT,
    }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], VendorInvoice.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], VendorInvoice.prototype, "lineItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "purchaseOrderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "paymentTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], VendorInvoice.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], VendorInvoice.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "approvedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VendorInvoice.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VendorInvoice.prototype, "remainingAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (workOrder) => workOrder.invoices),
    (0, typeorm_1.JoinColumn)({ name: 'workOrderId' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], VendorInvoice.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.Vendor),
    (0, typeorm_1.JoinColumn)({ name: 'vendorId' }),
    __metadata("design:type", vendor_entity_1.Vendor)
], VendorInvoice.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.vendorInvoice),
    __metadata("design:type", Array)
], VendorInvoice.prototype, "payments", void 0);
exports.VendorInvoice = VendorInvoice = __decorate([
    (0, typeorm_1.Entity)('vendor_invoices'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['workOrderId']),
    (0, typeorm_1.Index)(['vendorId']),
    (0, typeorm_1.Index)(['number']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['issueDate']),
    (0, typeorm_1.Index)(['dueDate'])
], VendorInvoice);
//# sourceMappingURL=vendor-invoice.entity.js.map