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
exports.VendorAvailability = exports.Weekday = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const vendor_entity_1 = require("./vendor.entity");
var Weekday;
(function (Weekday) {
    Weekday["MONDAY"] = "MONDAY";
    Weekday["TUESDAY"] = "TUESDAY";
    Weekday["WEDNESDAY"] = "WEDNESDAY";
    Weekday["THURSDAY"] = "THURSDAY";
    Weekday["FRIDAY"] = "FRIDAY";
    Weekday["SATURDAY"] = "SATURDAY";
    Weekday["SUNDAY"] = "SUNDAY";
})(Weekday || (exports.Weekday = Weekday = {}));
let VendorAvailability = class VendorAvailability extends base_entity_1.BaseEntity {
    vendorId;
    weekday;
    from;
    to;
    exceptions;
    isActive;
    vendor;
};
exports.VendorAvailability = VendorAvailability;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], VendorAvailability.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Weekday,
    }),
    __metadata("design:type", String)
], VendorAvailability.prototype, "weekday", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], VendorAvailability.prototype, "from", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], VendorAvailability.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], VendorAvailability.prototype, "exceptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], VendorAvailability.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.Vendor, (vendor) => vendor.availabilities),
    (0, typeorm_1.JoinColumn)({ name: 'vendorId' }),
    __metadata("design:type", vendor_entity_1.Vendor)
], VendorAvailability.prototype, "vendor", void 0);
exports.VendorAvailability = VendorAvailability = __decorate([
    (0, typeorm_1.Entity)('vendor_availabilities'),
    (0, typeorm_1.Index)(['vendorId']),
    (0, typeorm_1.Index)(['vendorId', 'weekday'], { unique: true })
], VendorAvailability);
//# sourceMappingURL=vendor-availability.entity.js.map