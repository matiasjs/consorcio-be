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
exports.UnitOccupancy = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const unit_entity_1 = require("./unit.entity");
const user_entity_1 = require("./user.entity");
let UnitOccupancy = class UnitOccupancy extends base_entity_1.BaseEntity {
    unitId;
    ownerUserId;
    tenantUserId;
    startDate;
    endDate;
    isPrimary;
    ownershipPercentage;
    notes;
    isActive;
    unit;
    ownerUser;
    tenantUser;
};
exports.UnitOccupancy = UnitOccupancy;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UnitOccupancy.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], UnitOccupancy.prototype, "ownerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], UnitOccupancy.prototype, "tenantUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], UnitOccupancy.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], UnitOccupancy.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UnitOccupancy.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], UnitOccupancy.prototype, "ownershipPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UnitOccupancy.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UnitOccupancy.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit, (unit) => unit.occupancies),
    (0, typeorm_1.JoinColumn)({ name: 'unitId' }),
    __metadata("design:type", unit_entity_1.Unit)
], UnitOccupancy.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'ownerUserId' }),
    __metadata("design:type", user_entity_1.User)
], UnitOccupancy.prototype, "ownerUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'tenantUserId' }),
    __metadata("design:type", user_entity_1.User)
], UnitOccupancy.prototype, "tenantUser", void 0);
exports.UnitOccupancy = UnitOccupancy = __decorate([
    (0, typeorm_1.Entity)('unit_occupancies'),
    (0, typeorm_1.Index)(['unitId']),
    (0, typeorm_1.Index)(['ownerUserId']),
    (0, typeorm_1.Index)(['tenantUserId'])
], UnitOccupancy);
//# sourceMappingURL=unit-occupancy.entity.js.map