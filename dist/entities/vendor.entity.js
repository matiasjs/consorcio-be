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
exports.Vendor = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const administration_entity_1 = require("./administration.entity");
const vendor_availability_entity_1 = require("./vendor-availability.entity");
let Vendor = class Vendor extends base_entity_1.BaseEntity {
    adminId;
    legalName;
    trade;
    email;
    phone;
    whatsapp;
    address;
    ratingAvg;
    ratingCount;
    isPreferred;
    cuit;
    website;
    description;
    certifications;
    serviceAreas;
    isActive;
    administration;
    availabilities;
};
exports.Vendor = Vendor;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Vendor.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Vendor.prototype, "legalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Vendor.prototype, "trade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Vendor.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "whatsapp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vendor.prototype, "ratingAvg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Vendor.prototype, "ratingCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Vendor.prototype, "isPreferred", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vendor.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Vendor.prototype, "certifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Vendor.prototype, "serviceAreas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Vendor.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration, (administration) => administration.vendors),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], Vendor.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vendor_availability_entity_1.VendorAvailability, (availability) => availability.vendor),
    __metadata("design:type", Array)
], Vendor.prototype, "availabilities", void 0);
exports.Vendor = Vendor = __decorate([
    (0, typeorm_1.Entity)('vendors'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['trade'])
], Vendor);
//# sourceMappingURL=vendor.entity.js.map