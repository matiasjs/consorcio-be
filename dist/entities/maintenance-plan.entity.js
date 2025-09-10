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
exports.MaintenancePlan = exports.PlanStatus = exports.MaintenanceFrequency = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const asset_entity_1 = require("./asset.entity");
const maintenance_task_entity_1 = require("./maintenance-task.entity");
var MaintenanceFrequency;
(function (MaintenanceFrequency) {
    MaintenanceFrequency["DAILY"] = "DAILY";
    MaintenanceFrequency["WEEKLY"] = "WEEKLY";
    MaintenanceFrequency["BIWEEKLY"] = "BIWEEKLY";
    MaintenanceFrequency["MONTHLY"] = "MONTHLY";
    MaintenanceFrequency["QUARTERLY"] = "QUARTERLY";
    MaintenanceFrequency["SEMIANNUAL"] = "SEMIANNUAL";
    MaintenanceFrequency["ANNUAL"] = "ANNUAL";
    MaintenanceFrequency["BIANNUAL"] = "BIANNUAL";
    MaintenanceFrequency["CUSTOM"] = "CUSTOM";
})(MaintenanceFrequency || (exports.MaintenanceFrequency = MaintenanceFrequency = {}));
var PlanStatus;
(function (PlanStatus) {
    PlanStatus["ACTIVE"] = "ACTIVE";
    PlanStatus["INACTIVE"] = "INACTIVE";
    PlanStatus["SUSPENDED"] = "SUSPENDED";
    PlanStatus["COMPLETED"] = "COMPLETED";
})(PlanStatus || (exports.PlanStatus = PlanStatus = {}));
let MaintenancePlan = class MaintenancePlan extends base_entity_1.BaseEntity {
    assetId;
    name;
    description;
    frequency;
    customFrequencyDays;
    taskList;
    slaHours;
    status;
    startDate;
    endDate;
    nextDueDate;
    lastCompletedDate;
    completedCount;
    overdueCount;
    estimatedCost;
    currency;
    assignedVendorId;
    assignedUserId;
    notes;
    requiresShutdown;
    shutdownInstructions;
    requiresSpecialAccess;
    accessInstructions;
    documents;
    asset;
    tasks;
};
exports.MaintenancePlan = MaintenancePlan;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MaintenanceFrequency,
    }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MaintenancePlan.prototype, "customFrequencyDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], MaintenancePlan.prototype, "taskList", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MaintenancePlan.prototype, "slaHours", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlanStatus,
        default: PlanStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], MaintenancePlan.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], MaintenancePlan.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], MaintenancePlan.prototype, "nextDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], MaintenancePlan.prototype, "lastCompletedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MaintenancePlan.prototype, "completedCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MaintenancePlan.prototype, "overdueCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], MaintenancePlan.prototype, "estimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "assignedVendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "assignedUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MaintenancePlan.prototype, "requiresShutdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "shutdownInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MaintenancePlan.prototype, "requiresSpecialAccess", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenancePlan.prototype, "accessInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MaintenancePlan.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_entity_1.Asset, (asset) => asset.maintenancePlans),
    (0, typeorm_1.JoinColumn)({ name: 'assetId' }),
    __metadata("design:type", asset_entity_1.Asset)
], MaintenancePlan.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => maintenance_task_entity_1.MaintenanceTask, (task) => task.plan),
    __metadata("design:type", Array)
], MaintenancePlan.prototype, "tasks", void 0);
exports.MaintenancePlan = MaintenancePlan = __decorate([
    (0, typeorm_1.Entity)('maintenance_plans'),
    (0, typeorm_1.Index)(['assetId']),
    (0, typeorm_1.Index)(['frequency']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['nextDueDate'])
], MaintenancePlan);
//# sourceMappingURL=maintenance-plan.entity.js.map