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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const administration_entity_1 = require("./administration.entity");
const enums_1 = require("../common/enums");
const owner_profile_entity_1 = require("./owner-profile.entity");
const tenant_profile_entity_1 = require("./tenant-profile.entity");
const staff_profile_entity_1 = require("./staff-profile.entity");
let User = class User extends base_entity_1.BaseEntity {
    adminId;
    email;
    phone;
    passwordHash;
    fullName;
    roles;
    status;
    lastLoginAt;
    lastLoginIp;
    emailVerifiedAt;
    resetPasswordToken;
    resetPasswordExpiresAt;
    administration;
    ownerProfile;
    tenantProfile;
    staffProfile;
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], User.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.UserRole,
        array: true,
        default: [enums_1.UserRole.READONLY],
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.UserStatus,
        default: enums_1.UserStatus.PENDING,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastLoginIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "resetPasswordExpiresAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration, (administration) => administration.users),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], User.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => owner_profile_entity_1.OwnerProfile, (profile) => profile.user),
    __metadata("design:type", owner_profile_entity_1.OwnerProfile)
], User.prototype, "ownerProfile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tenant_profile_entity_1.TenantProfile, (profile) => profile.user),
    __metadata("design:type", tenant_profile_entity_1.TenantProfile)
], User.prototype, "tenantProfile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => staff_profile_entity_1.StaffProfile, (profile) => profile.user),
    __metadata("design:type", staff_profile_entity_1.StaffProfile)
], User.prototype, "staffProfile", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['email', 'adminId'], { unique: true }),
    (0, typeorm_1.Index)(['adminId'])
], User);
//# sourceMappingURL=user.entity.js.map