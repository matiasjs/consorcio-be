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
exports.Inspection = exports.InspectionRecommendation = exports.InspectionStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const ticket_entity_1 = require("./ticket.entity");
const user_entity_1 = require("./user.entity");
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["SCHEDULED"] = "SCHEDULED";
    InspectionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    InspectionStatus["COMPLETED"] = "COMPLETED";
    InspectionStatus["CANCELLED"] = "CANCELLED";
    InspectionStatus["RESCHEDULED"] = "RESCHEDULED";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
var InspectionRecommendation;
(function (InspectionRecommendation) {
    InspectionRecommendation["NO_ACTION"] = "NO_ACTION";
    InspectionRecommendation["MINOR_REPAIR"] = "MINOR_REPAIR";
    InspectionRecommendation["MAJOR_REPAIR"] = "MAJOR_REPAIR";
    InspectionRecommendation["REPLACEMENT"] = "REPLACEMENT";
    InspectionRecommendation["EMERGENCY_ACTION"] = "EMERGENCY_ACTION";
    InspectionRecommendation["FURTHER_INSPECTION"] = "FURTHER_INSPECTION";
})(InspectionRecommendation || (exports.InspectionRecommendation = InspectionRecommendation = {}));
let Inspection = class Inspection extends base_entity_1.BaseEntity {
    ticketId;
    inspectorUserId;
    scheduledAt;
    visitedAt;
    notes;
    photos;
    recommendation;
    status;
    findings;
    estimatedRepairCost;
    currency;
    estimatedDurationHours;
    requiresSpecialist;
    specialistType;
    safetyRisk;
    safetyNotes;
    ticket;
    inspector;
};
exports.Inspection = Inspection;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Inspection.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Inspection.prototype, "inspectorUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Inspection.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Inspection.prototype, "visitedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Inspection.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Inspection.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InspectionRecommendation,
        nullable: true,
    }),
    __metadata("design:type", String)
], Inspection.prototype, "recommendation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InspectionStatus,
        default: InspectionStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Inspection.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Inspection.prototype, "findings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Inspection.prototype, "estimatedRepairCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], Inspection.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Inspection.prototype, "estimatedDurationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Inspection.prototype, "requiresSpecialist", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Inspection.prototype, "specialistType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Inspection.prototype, "safetyRisk", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Inspection.prototype, "safetyNotes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_entity_1.Ticket, (ticket) => ticket.inspections),
    (0, typeorm_1.JoinColumn)({ name: 'ticketId' }),
    __metadata("design:type", ticket_entity_1.Ticket)
], Inspection.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'inspectorUserId' }),
    __metadata("design:type", user_entity_1.User)
], Inspection.prototype, "inspector", void 0);
exports.Inspection = Inspection = __decorate([
    (0, typeorm_1.Entity)('inspections'),
    (0, typeorm_1.Index)(['ticketId']),
    (0, typeorm_1.Index)(['inspectorUserId']),
    (0, typeorm_1.Index)(['scheduledAt']),
    (0, typeorm_1.Index)(['status'])
], Inspection);
//# sourceMappingURL=inspection.entity.js.map