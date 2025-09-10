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
exports.Vote = exports.VoteType = exports.VoteChoice = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const resolution_entity_1 = require("./resolution.entity");
const unit_entity_1 = require("./unit.entity");
const user_entity_1 = require("./user.entity");
var VoteChoice;
(function (VoteChoice) {
    VoteChoice["FOR"] = "FOR";
    VoteChoice["AGAINST"] = "AGAINST";
    VoteChoice["ABSTAIN"] = "ABSTAIN";
})(VoteChoice || (exports.VoteChoice = VoteChoice = {}));
var VoteType;
(function (VoteType) {
    VoteType["DIRECT"] = "DIRECT";
    VoteType["PROXY"] = "PROXY";
    VoteType["ELECTRONIC"] = "ELECTRONIC";
})(VoteType || (exports.VoteType = VoteType = {}));
let Vote = class Vote extends base_entity_1.BaseEntity {
    resolutionId;
    unitId;
    voterUserId;
    userId;
    choice;
    weight;
    type;
    proxyFromUserId;
    proxyDocument;
    comments;
    votedAt;
    ipAddress;
    userAgent;
    isVerified;
    verifiedAt;
    verifiedByUserId;
    verificationNotes;
    isContested;
    contestReason;
    contestedAt;
    contestedByUserId;
    metadata;
    resolution;
    unit;
    voter;
    proxyFromUser;
    verifiedByUser;
    contestedByUser;
};
exports.Vote = Vote;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Vote.prototype, "resolutionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Vote.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "voterUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Vote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VoteChoice,
    }),
    __metadata("design:type", String)
], Vote.prototype, "choice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], Vote.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VoteType,
        default: VoteType.DIRECT,
    }),
    __metadata("design:type", String)
], Vote.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "proxyFromUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "proxyDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Vote.prototype, "votedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Vote.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Vote.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "verifiedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "verificationNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Vote.prototype, "isContested", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "contestReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Vote.prototype, "contestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "contestedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Vote.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resolution_entity_1.Resolution, (resolution) => resolution.votes),
    (0, typeorm_1.JoinColumn)({ name: 'resolutionId' }),
    __metadata("design:type", resolution_entity_1.Resolution)
], Vote.prototype, "resolution", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit),
    (0, typeorm_1.JoinColumn)({ name: 'unitId' }),
    __metadata("design:type", unit_entity_1.Unit)
], Vote.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'voterUserId' }),
    __metadata("design:type", user_entity_1.User)
], Vote.prototype, "voter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'proxyFromUserId' }),
    __metadata("design:type", user_entity_1.User)
], Vote.prototype, "proxyFromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'verifiedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], Vote.prototype, "verifiedByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'contestedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], Vote.prototype, "contestedByUser", void 0);
exports.Vote = Vote = __decorate([
    (0, typeorm_1.Entity)('votes'),
    (0, typeorm_1.Index)(['resolutionId']),
    (0, typeorm_1.Index)(['unitId']),
    (0, typeorm_1.Index)(['voterUserId']),
    (0, typeorm_1.Index)(['choice']),
    (0, typeorm_1.Index)(['resolutionId', 'unitId'], { unique: true })
], Vote);
//# sourceMappingURL=vote.entity.js.map