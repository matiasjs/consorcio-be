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
exports.Asset = exports.AssetStatus = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const building_entity_1 = require("./building.entity");
const vendor_entity_1 = require("./vendor.entity");
const maintenance_plan_entity_1 = require("./maintenance-plan.entity");
var AssetType;
(function (AssetType) {
    AssetType["ELEVATOR"] = "ELEVATOR";
    AssetType["HVAC"] = "HVAC";
    AssetType["PLUMBING"] = "PLUMBING";
    AssetType["ELECTRICAL"] = "ELECTRICAL";
    AssetType["FIRE_SAFETY"] = "FIRE_SAFETY";
    AssetType["SECURITY"] = "SECURITY";
    AssetType["LIGHTING"] = "LIGHTING";
    AssetType["GENERATOR"] = "GENERATOR";
    AssetType["PUMP"] = "PUMP";
    AssetType["BOILER"] = "BOILER";
    AssetType["INTERCOM"] = "INTERCOM";
    AssetType["ACCESS_CONTROL"] = "ACCESS_CONTROL";
    AssetType["CCTV"] = "CCTV";
    AssetType["ALARM"] = "ALARM";
    AssetType["OTHER"] = "OTHER";
})(AssetType || (exports.AssetType = AssetType = {}));
var AssetStatus;
(function (AssetStatus) {
    AssetStatus["ACTIVE"] = "ACTIVE";
    AssetStatus["INACTIVE"] = "INACTIVE";
    AssetStatus["UNDER_MAINTENANCE"] = "UNDER_MAINTENANCE";
    AssetStatus["OUT_OF_ORDER"] = "OUT_OF_ORDER";
    AssetStatus["RETIRED"] = "RETIRED";
})(AssetStatus || (exports.AssetStatus = AssetStatus = {}));
let Asset = class Asset extends base_entity_1.BaseEntity {
    buildingId;
    name;
    type;
    serial;
    installDate;
    vendorId;
    notes;
    manufacturer;
    model;
    location;
    specifications;
    purchasePrice;
    currency;
    warrantyExpiry;
    warrantyProvider;
    status;
    expectedLifeYears;
    lastMaintenanceDate;
    nextMaintenanceDate;
    documents;
    photos;
    maintenanceInstructions;
    safetyNotes;
    building;
    preferredVendor;
    maintenancePlans;
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Asset.prototype, "buildingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetType,
    }),
    __metadata("design:type", String)
], Asset.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "serial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Asset.prototype, "installDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "manufacturer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "specifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Asset.prototype, "purchasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], Asset.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Asset.prototype, "warrantyExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "warrantyProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetStatus,
        default: AssetStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Asset.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Asset.prototype, "expectedLifeYears", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Asset.prototype, "lastMaintenanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Asset.prototype, "nextMaintenanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Asset.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Asset.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "maintenanceInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "safetyNotes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => building_entity_1.Building),
    (0, typeorm_1.JoinColumn)({ name: 'buildingId' }),
    __metadata("design:type", building_entity_1.Building)
], Asset.prototype, "building", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.Vendor),
    (0, typeorm_1.JoinColumn)({ name: 'vendorId' }),
    __metadata("design:type", vendor_entity_1.Vendor)
], Asset.prototype, "preferredVendor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => maintenance_plan_entity_1.MaintenancePlan, (plan) => plan.asset),
    __metadata("design:type", Array)
], Asset.prototype, "maintenancePlans", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)('assets'),
    (0, typeorm_1.Index)(['buildingId']),
    (0, typeorm_1.Index)(['type']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['vendorId'])
], Asset);
//# sourceMappingURL=asset.entity.js.map