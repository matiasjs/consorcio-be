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
exports.WorkOrder = exports.WorkOrderStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const ticket_entity_1 = require("./ticket.entity");
const vendor_entity_1 = require("./vendor.entity");
const user_entity_1 = require("./user.entity");
const quote_entity_1 = require("./quote.entity");
const schedule_slot_entity_1 = require("./schedule-slot.entity");
const work_order_material_entity_1 = require("./work-order-material.entity");
const vendor_invoice_entity_1 = require("./vendor-invoice.entity");
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["DRAFT"] = "DRAFT";
    WorkOrderStatus["PENDING_QUOTE"] = "PENDING_QUOTE";
    WorkOrderStatus["QUOTED"] = "QUOTED";
    WorkOrderStatus["APPROVED"] = "APPROVED";
    WorkOrderStatus["REJECTED"] = "REJECTED";
    WorkOrderStatus["SCHEDULED"] = "SCHEDULED";
    WorkOrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkOrderStatus["COMPLETED"] = "COMPLETED";
    WorkOrderStatus["CANCELLED"] = "CANCELLED";
    WorkOrderStatus["ON_HOLD"] = "ON_HOLD";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
let WorkOrder = class WorkOrder extends base_entity_1.BaseEntity {
    ticketId;
    vendorId;
    assignedByUserId;
    scopeOfWork;
    scheduledAt;
    status;
    beforePhotos;
    afterPhotos;
    materialsPlan;
    notes;
    startedAt;
    completedAt;
    estimatedDurationHours;
    actualDurationHours;
    estimatedCost;
    actualCost;
    currency;
    completionNotes;
    qualityRating;
    qualityFeedback;
    ticket;
    vendor;
    assignedByUser;
    quotes;
    scheduleSlots;
    materials;
    invoices;
};
exports.WorkOrder = WorkOrder;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "assignedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "scopeOfWork", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkOrderStatus,
        default: WorkOrderStatus.DRAFT,
    }),
    __metadata("design:type", String)
], WorkOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], WorkOrder.prototype, "beforePhotos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], WorkOrder.prototype, "afterPhotos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], WorkOrder.prototype, "materialsPlan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WorkOrder.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "estimatedDurationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "actualDurationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "estimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "actualCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "completionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], WorkOrder.prototype, "qualityRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "qualityFeedback", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_entity_1.Ticket, (ticket) => ticket.workOrders),
    (0, typeorm_1.JoinColumn)({ name: 'ticketId' }),
    __metadata("design:type", ticket_entity_1.Ticket)
], WorkOrder.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.Vendor),
    (0, typeorm_1.JoinColumn)({ name: 'vendorId' }),
    __metadata("design:type", vendor_entity_1.Vendor)
], WorkOrder.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'assignedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], WorkOrder.prototype, "assignedByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quote_entity_1.Quote, (quote) => quote.workOrder),
    __metadata("design:type", Array)
], WorkOrder.prototype, "quotes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => schedule_slot_entity_1.ScheduleSlot, (slot) => slot.workOrder),
    __metadata("design:type", Array)
], WorkOrder.prototype, "scheduleSlots", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_order_material_entity_1.WorkOrderMaterial, (material) => material.workOrder),
    __metadata("design:type", Array)
], WorkOrder.prototype, "materials", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vendor_invoice_entity_1.VendorInvoice, (invoice) => invoice.workOrder),
    __metadata("design:type", Array)
], WorkOrder.prototype, "invoices", void 0);
exports.WorkOrder = WorkOrder = __decorate([
    (0, typeorm_1.Entity)('work_orders'),
    (0, typeorm_1.Index)(['ticketId']),
    (0, typeorm_1.Index)(['vendorId']),
    (0, typeorm_1.Index)(['assignedByUserId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['scheduledAt'])
], WorkOrder);
//# sourceMappingURL=work-order.entity.js.map