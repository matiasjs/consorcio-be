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
exports.Resolution = exports.ResolutionType = exports.ResolutionStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const meeting_entity_1 = require("./meeting.entity");
const vote_entity_1 = require("./vote.entity");
var ResolutionStatus;
(function (ResolutionStatus) {
    ResolutionStatus["DRAFT"] = "DRAFT";
    ResolutionStatus["PROPOSED"] = "PROPOSED";
    ResolutionStatus["VOTING"] = "VOTING";
    ResolutionStatus["APPROVED"] = "APPROVED";
    ResolutionStatus["REJECTED"] = "REJECTED";
    ResolutionStatus["WITHDRAWN"] = "WITHDRAWN";
    ResolutionStatus["DEFERRED"] = "DEFERRED";
})(ResolutionStatus || (exports.ResolutionStatus = ResolutionStatus = {}));
var ResolutionType;
(function (ResolutionType) {
    ResolutionType["ORDINARY"] = "ORDINARY";
    ResolutionType["SPECIAL"] = "SPECIAL";
    ResolutionType["FINANCIAL"] = "FINANCIAL";
    ResolutionType["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    ResolutionType["MAINTENANCE"] = "MAINTENANCE";
    ResolutionType["BYLAW_CHANGE"] = "BYLAW_CHANGE";
})(ResolutionType || (exports.ResolutionType = ResolutionType = {}));
let Resolution = class Resolution extends base_entity_1.BaseEntity {
    meetingId;
    title;
    description;
    requiresVote;
    status;
    type;
    orderInMeeting;
    requiredMajority;
    votingStartedAt;
    votingEndedAt;
    votesFor;
    votesAgainst;
    votesAbstain;
    totalVotingWeight;
    weightFor;
    weightAgainst;
    weightAbstain;
    approvalPercentage;
    rationale;
    financialImpact;
    estimatedCost;
    currency;
    implementationDate;
    implementationNotes;
    proposedByUserId;
    proposedAt;
    rejectionReason;
    withdrawalReason;
    attachments;
    legalReferences;
    requiresUnanimity;
    isUrgent;
    urgencyReason;
    meeting;
    votes;
};
exports.Resolution = Resolution;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Resolution.prototype, "meetingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Resolution.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Resolution.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Resolution.prototype, "requiresVote", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ResolutionStatus,
        default: ResolutionStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Resolution.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ResolutionType,
        default: ResolutionType.ORDINARY,
    }),
    __metadata("design:type", String)
], Resolution.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Resolution.prototype, "orderInMeeting", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Resolution.prototype, "requiredMajority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Resolution.prototype, "votingStartedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Resolution.prototype, "votingEndedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Resolution.prototype, "votesFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Resolution.prototype, "votesAgainst", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Resolution.prototype, "votesAbstain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Resolution.prototype, "totalVotingWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Resolution.prototype, "weightFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Resolution.prototype, "weightAgainst", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Resolution.prototype, "weightAbstain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Resolution.prototype, "approvalPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "rationale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "financialImpact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Resolution.prototype, "estimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], Resolution.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Resolution.prototype, "implementationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "implementationNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "proposedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Resolution.prototype, "proposedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "withdrawalReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Resolution.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "legalReferences", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Resolution.prototype, "requiresUnanimity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Resolution.prototype, "isUrgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resolution.prototype, "urgencyReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => meeting_entity_1.Meeting, (meeting) => meeting.resolutions),
    (0, typeorm_1.JoinColumn)({ name: 'meetingId' }),
    __metadata("design:type", meeting_entity_1.Meeting)
], Resolution.prototype, "meeting", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_entity_1.Vote, (vote) => vote.resolution),
    __metadata("design:type", Array)
], Resolution.prototype, "votes", void 0);
exports.Resolution = Resolution = __decorate([
    (0, typeorm_1.Entity)('resolutions'),
    (0, typeorm_1.Index)(['meetingId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['type']),
    (0, typeorm_1.Index)(['requiresVote'])
], Resolution);
//# sourceMappingURL=resolution.entity.js.map