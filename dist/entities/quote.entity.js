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
exports.Quote = exports.QuoteStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const work_order_entity_1 = require("./work-order.entity");
const vendor_entity_1 = require("./vendor.entity");
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["DRAFT"] = "DRAFT";
    QuoteStatus["SUBMITTED"] = "SUBMITTED";
    QuoteStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    QuoteStatus["APPROVED"] = "APPROVED";
    QuoteStatus["REJECTED"] = "REJECTED";
    QuoteStatus["EXPIRED"] = "EXPIRED";
    QuoteStatus["CANCELLED"] = "CANCELLED";
})(QuoteStatus || (exports.QuoteStatus = QuoteStatus = {}));
let Quote = class Quote extends base_entity_1.BaseEntity {
    workOrderId;
    vendorId;
    amountSubtotal;
    materialsEstimate;
    laborCost;
    taxes;
    total;
    currency;
    status;
    description;
    materialBreakdown;
    estimatedDurationHours;
    validUntil;
    terms;
    notes;
    attachments;
    submittedAt;
    reviewedAt;
    reviewedByUserId;
    rejectionReason;
    workOrder;
    vendor;
};
exports.Quote = Quote;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Quote.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Quote.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Quote.prototype, "amountSubtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Quote.prototype, "materialsEstimate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Quote.prototype, "laborCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Quote.prototype, "taxes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Quote.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], Quote.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuoteStatus,
        default: QuoteStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Quote.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quote.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Quote.prototype, "materialBreakdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Quote.prototype, "estimatedDurationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Quote.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quote.prototype, "terms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quote.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Quote.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quote.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quote.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Quote.prototype, "reviewedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quote.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (workOrder) => workOrder.quotes),
    (0, typeorm_1.JoinColumn)({ name: 'workOrderId' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], Quote.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.Vendor),
    (0, typeorm_1.JoinColumn)({ name: 'vendorId' }),
    __metadata("design:type", vendor_entity_1.Vendor)
], Quote.prototype, "vendor", void 0);
exports.Quote = Quote = __decorate([
    (0, typeorm_1.Entity)('quotes'),
    (0, typeorm_1.Index)(['workOrderId']),
    (0, typeorm_1.Index)(['vendorId']),
    (0, typeorm_1.Index)(['status'])
], Quote);
//# sourceMappingURL=quote.entity.js.map