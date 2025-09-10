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
exports.WorkOrderMaterial = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const work_order_entity_1 = require("./work-order.entity");
const material_item_entity_1 = require("./material-item.entity");
let WorkOrderMaterial = class WorkOrderMaterial extends base_entity_1.BaseEntity {
    workOrderId;
    materialItemId;
    qty;
    unitCost;
    currency;
    supplierName;
    notes;
    actualQtyUsed;
    actualCost;
    isSuppliedByVendor;
    isSuppliedByClient;
    deliveryDate;
    deliveryNotes;
    invoiceReference;
    workOrder;
    materialItem;
};
exports.WorkOrderMaterial = WorkOrderMaterial;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkOrderMaterial.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WorkOrderMaterial.prototype, "materialItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], WorkOrderMaterial.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], WorkOrderMaterial.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], WorkOrderMaterial.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WorkOrderMaterial.prototype, "supplierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrderMaterial.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], WorkOrderMaterial.prototype, "actualQtyUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], WorkOrderMaterial.prototype, "actualCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], WorkOrderMaterial.prototype, "isSuppliedByVendor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], WorkOrderMaterial.prototype, "isSuppliedByClient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], WorkOrderMaterial.prototype, "deliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrderMaterial.prototype, "deliveryNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WorkOrderMaterial.prototype, "invoiceReference", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (workOrder) => workOrder.materials),
    (0, typeorm_1.JoinColumn)({ name: 'workOrderId' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], WorkOrderMaterial.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => material_item_entity_1.MaterialItem, (materialItem) => materialItem.workOrderMaterials),
    (0, typeorm_1.JoinColumn)({ name: 'materialItemId' }),
    __metadata("design:type", material_item_entity_1.MaterialItem)
], WorkOrderMaterial.prototype, "materialItem", void 0);
exports.WorkOrderMaterial = WorkOrderMaterial = __decorate([
    (0, typeorm_1.Entity)('work_order_materials'),
    (0, typeorm_1.Index)(['workOrderId']),
    (0, typeorm_1.Index)(['materialItemId'])
], WorkOrderMaterial);
//# sourceMappingURL=work-order-material.entity.js.map