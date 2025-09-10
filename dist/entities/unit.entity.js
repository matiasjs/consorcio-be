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
exports.Unit = exports.UnitType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const building_entity_1 = require("./building.entity");
const unit_occupancy_entity_1 = require("./unit-occupancy.entity");
var UnitType;
(function (UnitType) {
    UnitType["APARTMENT"] = "APARTMENT";
    UnitType["STORE"] = "STORE";
    UnitType["GARAGE"] = "GARAGE";
    UnitType["STORAGE"] = "STORAGE";
    UnitType["OFFICE"] = "OFFICE";
})(UnitType || (exports.UnitType = UnitType = {}));
let Unit = class Unit extends base_entity_1.BaseEntity {
    buildingId;
    label;
    type;
    floor;
    m2;
    isRented;
    ownershipPercentage;
    notes;
    isActive;
    building;
    occupancies;
};
exports.Unit = Unit;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Unit.prototype, "buildingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Unit.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UnitType,
        default: UnitType.APARTMENT,
    }),
    __metadata("design:type", String)
], Unit.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Unit.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Unit.prototype, "m2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Unit.prototype, "isRented", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Unit.prototype, "ownershipPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Unit.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Unit.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => building_entity_1.Building, (building) => building.units),
    (0, typeorm_1.JoinColumn)({ name: 'buildingId' }),
    __metadata("design:type", building_entity_1.Building)
], Unit.prototype, "building", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => unit_occupancy_entity_1.UnitOccupancy, (occupancy) => occupancy.unit),
    __metadata("design:type", Array)
], Unit.prototype, "occupancies", void 0);
exports.Unit = Unit = __decorate([
    (0, typeorm_1.Entity)('units'),
    (0, typeorm_1.Index)(['buildingId']),
    (0, typeorm_1.Index)(['buildingId', 'label'], { unique: true })
], Unit);
//# sourceMappingURL=unit.entity.js.map