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
exports.ScheduleSlot = exports.ProposedBy = exports.ScheduleSlotStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const work_order_entity_1 = require("./work-order.entity");
var ScheduleSlotStatus;
(function (ScheduleSlotStatus) {
    ScheduleSlotStatus["PROPOSED"] = "PROPOSED";
    ScheduleSlotStatus["CONFIRMED"] = "CONFIRMED";
    ScheduleSlotStatus["REJECTED"] = "REJECTED";
    ScheduleSlotStatus["CANCELLED"] = "CANCELLED";
    ScheduleSlotStatus["COMPLETED"] = "COMPLETED";
})(ScheduleSlotStatus || (exports.ScheduleSlotStatus = ScheduleSlotStatus = {}));
var ProposedBy;
(function (ProposedBy) {
    ProposedBy["VENDOR"] = "VENDOR";
    ProposedBy["ADMINISTRATION"] = "ADMINISTRATION";
    ProposedBy["SYSTEM"] = "SYSTEM";
})(ProposedBy || (exports.ProposedBy = ProposedBy = {}));
let ScheduleSlot = class ScheduleSlot extends base_entity_1.BaseEntity {
    workOrderId;
    proposedBy;
    start;
    end;
    status;
    notes;
    rejectionReason;
    confirmedByUserId;
    confirmedAt;
    requiresAccess;
    accessInstructions;
    contactPhone;
    specialRequirements;
    workOrder;
};
exports.ScheduleSlot = ScheduleSlot;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProposedBy,
    }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "proposedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ScheduleSlot.prototype, "start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ScheduleSlot.prototype, "end", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ScheduleSlotStatus,
        default: ScheduleSlotStatus.PROPOSED,
    }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "confirmedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ScheduleSlot.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ScheduleSlot.prototype, "requiresAccess", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "accessInstructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ScheduleSlot.prototype, "specialRequirements", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder, (workOrder) => workOrder.scheduleSlots),
    (0, typeorm_1.JoinColumn)({ name: 'workOrderId' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], ScheduleSlot.prototype, "workOrder", void 0);
exports.ScheduleSlot = ScheduleSlot = __decorate([
    (0, typeorm_1.Entity)('schedule_slots'),
    (0, typeorm_1.Index)(['workOrderId']),
    (0, typeorm_1.Index)(['start']),
    (0, typeorm_1.Index)(['status'])
], ScheduleSlot);
//# sourceMappingURL=schedule-slot.entity.js.map