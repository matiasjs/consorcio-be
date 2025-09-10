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
exports.Meeting = exports.MeetingType = exports.MeetingStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const administration_entity_1 = require("./administration.entity");
const building_entity_1 = require("./building.entity");
const resolution_entity_1 = require("./resolution.entity");
var MeetingStatus;
(function (MeetingStatus) {
    MeetingStatus["SCHEDULED"] = "SCHEDULED";
    MeetingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MeetingStatus["COMPLETED"] = "COMPLETED";
    MeetingStatus["CANCELLED"] = "CANCELLED";
    MeetingStatus["POSTPONED"] = "POSTPONED";
})(MeetingStatus || (exports.MeetingStatus = MeetingStatus = {}));
var MeetingType;
(function (MeetingType) {
    MeetingType["ORDINARY"] = "ORDINARY";
    MeetingType["EXTRAORDINARY"] = "EXTRAORDINARY";
    MeetingType["EMERGENCY"] = "EMERGENCY";
    MeetingType["BOARD"] = "BOARD";
    MeetingType["COMMITTEE"] = "COMMITTEE";
})(MeetingType || (exports.MeetingType = MeetingType = {}));
let Meeting = class Meeting extends base_entity_1.BaseEntity {
    adminId;
    buildingId;
    title;
    description;
    scheduledAt;
    location;
    agenda;
    documents;
    status;
    type;
    minutes;
    startedAt;
    endedAt;
    expectedAttendees;
    actualAttendees;
    quorumPercentage;
    quorumReached;
    chairpersonUserId;
    secretaryUserId;
    notes;
    attendees;
    cancellationReason;
    rescheduledFrom;
    rescheduleReason;
    recordings;
    administration;
    building;
    resolutions;
};
exports.Meeting = Meeting;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Meeting.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Meeting.prototype, "buildingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Meeting.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Meeting.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Meeting.prototype, "agenda", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Meeting.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MeetingStatus,
        default: MeetingStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Meeting.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MeetingType,
        default: MeetingType.ORDINARY,
    }),
    __metadata("design:type", String)
], Meeting.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Meeting.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Meeting.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Meeting.prototype, "expectedAttendees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Meeting.prototype, "actualAttendees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meeting.prototype, "quorumPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Meeting.prototype, "quorumReached", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "chairpersonUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "secretaryUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Meeting.prototype, "attendees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Meeting.prototype, "rescheduledFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Meeting.prototype, "rescheduleReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Meeting.prototype, "recordings", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], Meeting.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => building_entity_1.Building),
    (0, typeorm_1.JoinColumn)({ name: 'buildingId' }),
    __metadata("design:type", building_entity_1.Building)
], Meeting.prototype, "building", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => resolution_entity_1.Resolution, (resolution) => resolution.meeting),
    __metadata("design:type", Array)
], Meeting.prototype, "resolutions", void 0);
exports.Meeting = Meeting = __decorate([
    (0, typeorm_1.Entity)('meetings'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['buildingId']),
    (0, typeorm_1.Index)(['scheduledAt']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['type'])
], Meeting);
//# sourceMappingURL=meeting.entity.js.map