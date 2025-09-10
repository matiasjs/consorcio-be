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
exports.Ticket = exports.TicketChannel = exports.TicketPriority = exports.TicketStatus = exports.TicketType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const administration_entity_1 = require("./administration.entity");
const building_entity_1 = require("./building.entity");
const unit_entity_1 = require("./unit.entity");
const user_entity_1 = require("./user.entity");
const inspection_entity_1 = require("./inspection.entity");
const work_order_entity_1 = require("./work-order.entity");
const message_entity_1 = require("./message.entity");
var TicketType;
(function (TicketType) {
    TicketType["MAINTENANCE"] = "MAINTENANCE";
    TicketType["REPAIR"] = "REPAIR";
    TicketType["COMPLAINT"] = "COMPLAINT";
    TicketType["EMERGENCY"] = "EMERGENCY";
    TicketType["CLEANING"] = "CLEANING";
    TicketType["SECURITY"] = "SECURITY";
    TicketType["OTHER"] = "OTHER";
})(TicketType || (exports.TicketType = TicketType = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["PENDING_INSPECTION"] = "PENDING_INSPECTION";
    TicketStatus["PENDING_QUOTE"] = "PENDING_QUOTE";
    TicketStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    TicketStatus["APPROVED"] = "APPROVED";
    TicketStatus["REJECTED"] = "REJECTED";
    TicketStatus["COMPLETED"] = "COMPLETED";
    TicketStatus["CLOSED"] = "CLOSED";
    TicketStatus["CANCELLED"] = "CANCELLED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "LOW";
    TicketPriority["MEDIUM"] = "MEDIUM";
    TicketPriority["HIGH"] = "HIGH";
    TicketPriority["URGENT"] = "URGENT";
    TicketPriority["EMERGENCY"] = "EMERGENCY";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
var TicketChannel;
(function (TicketChannel) {
    TicketChannel["WEB"] = "WEB";
    TicketChannel["MOBILE"] = "MOBILE";
    TicketChannel["PHONE"] = "PHONE";
    TicketChannel["EMAIL"] = "EMAIL";
    TicketChannel["WHATSAPP"] = "WHATSAPP";
    TicketChannel["IN_PERSON"] = "IN_PERSON";
})(TicketChannel || (exports.TicketChannel = TicketChannel = {}));
let Ticket = class Ticket extends base_entity_1.BaseEntity {
    adminId;
    buildingId;
    unitId;
    createdByUserId;
    type;
    channel;
    title;
    description;
    priority;
    status;
    attachments;
    resolution;
    resolvedAt;
    resolvedByUserId;
    dueDate;
    estimatedCost;
    currency;
    administration;
    building;
    unit;
    createdByUser;
    resolvedByUser;
    inspections;
    workOrders;
    messages;
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Ticket.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Ticket.prototype, "buildingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Ticket.prototype, "createdByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketType,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketChannel,
        default: TicketChannel.WEB,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Ticket.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Ticket.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Ticket.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "resolution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Ticket.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "resolvedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Ticket.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "estimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], Ticket.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], Ticket.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => building_entity_1.Building),
    (0, typeorm_1.JoinColumn)({ name: 'buildingId' }),
    __metadata("design:type", building_entity_1.Building)
], Ticket.prototype, "building", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit),
    (0, typeorm_1.JoinColumn)({ name: 'unitId' }),
    __metadata("design:type", unit_entity_1.Unit)
], Ticket.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'createdByUserId' }),
    __metadata("design:type", user_entity_1.User)
], Ticket.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'resolvedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], Ticket.prototype, "resolvedByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inspection_entity_1.Inspection, (inspection) => inspection.ticket),
    __metadata("design:type", Array)
], Ticket.prototype, "inspections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_order_entity_1.WorkOrder, (workOrder) => workOrder.ticket),
    __metadata("design:type", Array)
], Ticket.prototype, "workOrders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.ticket),
    __metadata("design:type", Array)
], Ticket.prototype, "messages", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('tickets'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['buildingId']),
    (0, typeorm_1.Index)(['unitId']),
    (0, typeorm_1.Index)(['createdByUserId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['priority']),
    (0, typeorm_1.Index)(['type'])
], Ticket);
//# sourceMappingURL=ticket.entity.js.map