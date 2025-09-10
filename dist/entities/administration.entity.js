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
exports.Administration = exports.PlanTier = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const building_entity_1 = require("./building.entity");
const vendor_entity_1 = require("./vendor.entity");
var PlanTier;
(function (PlanTier) {
    PlanTier["BASIC"] = "BASIC";
    PlanTier["STANDARD"] = "STANDARD";
    PlanTier["PREMIUM"] = "PREMIUM";
    PlanTier["ENTERPRISE"] = "ENTERPRISE";
})(PlanTier || (exports.PlanTier = PlanTier = {}));
let Administration = class Administration extends base_entity_1.BaseEntity {
    name;
    cuit;
    email;
    phone;
    address;
    planTier;
    isActive;
    users;
    buildings;
    vendors;
};
exports.Administration = Administration;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Administration.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Administration.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Administration.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Administration.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Administration.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlanTier,
        default: PlanTier.BASIC,
    }),
    __metadata("design:type", String)
], Administration.prototype, "planTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Administration.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.administration),
    __metadata("design:type", Array)
], Administration.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => building_entity_1.Building, (building) => building.administration),
    __metadata("design:type", Array)
], Administration.prototype, "buildings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vendor_entity_1.Vendor, (vendor) => vendor.administration),
    __metadata("design:type", Array)
], Administration.prototype, "vendors", void 0);
exports.Administration = Administration = __decorate([
    (0, typeorm_1.Entity)('administrations'),
    (0, typeorm_1.Index)(['cuit'], { unique: true }),
    (0, typeorm_1.Index)(['email'], { unique: true })
], Administration);
//# sourceMappingURL=administration.entity.js.map