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
exports.MaterialItem = exports.MaterialCategory = exports.MaterialUnit = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const work_order_material_entity_1 = require("./work-order-material.entity");
var MaterialUnit;
(function (MaterialUnit) {
    MaterialUnit["PIECE"] = "PIECE";
    MaterialUnit["METER"] = "METER";
    MaterialUnit["SQUARE_METER"] = "SQUARE_METER";
    MaterialUnit["CUBIC_METER"] = "CUBIC_METER";
    MaterialUnit["KILOGRAM"] = "KILOGRAM";
    MaterialUnit["LITER"] = "LITER";
    MaterialUnit["HOUR"] = "HOUR";
    MaterialUnit["DAY"] = "DAY";
    MaterialUnit["PACKAGE"] = "PACKAGE";
    MaterialUnit["BOX"] = "BOX";
    MaterialUnit["ROLL"] = "ROLL";
    MaterialUnit["TUBE"] = "TUBE";
    MaterialUnit["BAG"] = "BAG";
})(MaterialUnit || (exports.MaterialUnit = MaterialUnit = {}));
var MaterialCategory;
(function (MaterialCategory) {
    MaterialCategory["PLUMBING"] = "PLUMBING";
    MaterialCategory["ELECTRICAL"] = "ELECTRICAL";
    MaterialCategory["PAINTING"] = "PAINTING";
    MaterialCategory["CONSTRUCTION"] = "CONSTRUCTION";
    MaterialCategory["HARDWARE"] = "HARDWARE";
    MaterialCategory["CLEANING"] = "CLEANING";
    MaterialCategory["SAFETY"] = "SAFETY";
    MaterialCategory["TOOLS"] = "TOOLS";
    MaterialCategory["LABOR"] = "LABOR";
    MaterialCategory["OTHER"] = "OTHER";
})(MaterialCategory || (exports.MaterialCategory = MaterialCategory = {}));
let MaterialItem = class MaterialItem extends base_entity_1.BaseEntity {
    name;
    sku;
    unit;
    defaultCost;
    currency;
    category;
    description;
    brand;
    model;
    specifications;
    supplier;
    supplierCode;
    minimumStock;
    currentStock;
    weight;
    dimensions;
    isActive;
    notes;
    workOrderMaterials;
};
exports.MaterialItem = MaterialItem;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], MaterialItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, unique: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MaterialUnit,
    }),
    __metadata("design:type", String)
], MaterialItem.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], MaterialItem.prototype, "defaultCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], MaterialItem.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MaterialCategory,
        default: MaterialCategory.OTHER,
    }),
    __metadata("design:type", String)
], MaterialItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "specifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "supplierCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MaterialItem.prototype, "minimumStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MaterialItem.prototype, "currentStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], MaterialItem.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], MaterialItem.prototype, "dimensions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], MaterialItem.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaterialItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_order_material_entity_1.WorkOrderMaterial, (workOrderMaterial) => workOrderMaterial.materialItem),
    __metadata("design:type", Array)
], MaterialItem.prototype, "workOrderMaterials", void 0);
exports.MaterialItem = MaterialItem = __decorate([
    (0, typeorm_1.Entity)('material_items'),
    (0, typeorm_1.Index)(['name']),
    (0, typeorm_1.Index)(['sku']),
    (0, typeorm_1.Index)(['category'])
], MaterialItem);
//# sourceMappingURL=material-item.entity.js.map