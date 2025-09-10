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
exports.MaintenanceTask = exports.PerformedByType = exports.TaskStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const maintenance_plan_entity_1 = require("./maintenance-plan.entity");
const user_entity_1 = require("./user.entity");
const vendor_entity_1 = require("./vendor.entity");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["SCHEDULED"] = "SCHEDULED";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["CANCELLED"] = "CANCELLED";
    TaskStatus["OVERDUE"] = "OVERDUE";
    TaskStatus["RESCHEDULED"] = "RESCHEDULED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var PerformedByType;
(function (PerformedByType) {
    PerformedByType["USER"] = "USER";
    PerformedByType["VENDOR"] = "VENDOR";
})(PerformedByType || (exports.PerformedByType = PerformedByType = {}));
let MaintenanceTask = class MaintenanceTask extends base_entity_1.BaseEntity {
    planId;
    title;
    description;
    scheduledFor;
    status;
    performedByType;
    performedByUserId;
    performedByVendorId;
    startedAt;
    completedAt;
    actualDurationMinutes;
    notes;
    evidencePhotos;
    completedTasks;
    findings;
    recommendations;
    requiresFollowUp;
    followUpDate;
    followUpNotes;
    actualCost;
    currency;
    materialsUsed;
    qualityRating;
    qualityFeedback;
    cancellationReason;
    rescheduledFrom;
    rescheduleReason;
    plan;
    performedByUser;
    performedByVendor;
};
exports.MaintenanceTask = MaintenanceTask;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], MaintenanceTask.prototype, "scheduledFor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PerformedByType,
        nullable: true,
    }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "performedByType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "performedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "performedByVendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MaintenanceTask.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MaintenanceTask.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], MaintenanceTask.prototype, "actualDurationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MaintenanceTask.prototype, "evidencePhotos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MaintenanceTask.prototype, "completedTasks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "findings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MaintenanceTask.prototype, "requiresFollowUp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], MaintenanceTask.prototype, "followUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "followUpNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], MaintenanceTask.prototype, "actualCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MaintenanceTask.prototype, "materialsUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], MaintenanceTask.prototype, "qualityRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "qualityFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MaintenanceTask.prototype, "rescheduledFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceTask.prototype, "rescheduleReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => maintenance_plan_entity_1.MaintenancePlan, (plan) => plan.tasks),
    (0, typeorm_1.JoinColumn)({ name: 'planId' }),
    __metadata("design:type", maintenance_plan_entity_1.MaintenancePlan)
], MaintenanceTask.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'performedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], MaintenanceTask.prototype, "performedByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.Vendor),
    (0, typeorm_1.JoinColumn)({ name: 'performedByVendorId' }),
    __metadata("design:type", vendor_entity_1.Vendor)
], MaintenanceTask.prototype, "performedByVendor", void 0);
exports.MaintenanceTask = MaintenanceTask = __decorate([
    (0, typeorm_1.Entity)('maintenance_tasks'),
    (0, typeorm_1.Index)(['planId']),
    (0, typeorm_1.Index)(['scheduledFor']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['performedByUserId']),
    (0, typeorm_1.Index)(['performedByVendorId'])
], MaintenanceTask);
//# sourceMappingURL=maintenance-task.entity.js.map