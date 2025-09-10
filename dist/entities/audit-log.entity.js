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
exports.AuditLog = exports.AuditSeverity = exports.AuditEntity = exports.AuditAction = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const administration_entity_1 = require("./administration.entity");
const user_entity_1 = require("./user.entity");
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["READ"] = "READ";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["APPROVE"] = "APPROVE";
    AuditAction["REJECT"] = "REJECT";
    AuditAction["ASSIGN"] = "ASSIGN";
    AuditAction["UNASSIGN"] = "UNASSIGN";
    AuditAction["ACTIVATE"] = "ACTIVATE";
    AuditAction["DEACTIVATE"] = "DEACTIVATE";
    AuditAction["SUSPEND"] = "SUSPEND";
    AuditAction["RESTORE"] = "RESTORE";
    AuditAction["ARCHIVE"] = "ARCHIVE";
    AuditAction["PUBLISH"] = "PUBLISH";
    AuditAction["UNPUBLISH"] = "UNPUBLISH";
    AuditAction["SEND"] = "SEND";
    AuditAction["RECEIVE"] = "RECEIVE";
    AuditAction["UPLOAD"] = "UPLOAD";
    AuditAction["DOWNLOAD"] = "DOWNLOAD";
    AuditAction["SHARE"] = "SHARE";
    AuditAction["UNSHARE"] = "UNSHARE";
    AuditAction["VOTE"] = "VOTE";
    AuditAction["SCHEDULE"] = "SCHEDULE";
    AuditAction["RESCHEDULE"] = "RESCHEDULE";
    AuditAction["CANCEL"] = "CANCEL";
    AuditAction["COMPLETE"] = "COMPLETE";
    AuditAction["CUSTOM"] = "CUSTOM";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var AuditEntity;
(function (AuditEntity) {
    AuditEntity["ADMINISTRATION"] = "ADMINISTRATION";
    AuditEntity["USER"] = "USER";
    AuditEntity["BUILDING"] = "BUILDING";
    AuditEntity["UNIT"] = "UNIT";
    AuditEntity["VENDOR"] = "VENDOR";
    AuditEntity["TICKET"] = "TICKET";
    AuditEntity["INSPECTION"] = "INSPECTION";
    AuditEntity["WORK_ORDER"] = "WORK_ORDER";
    AuditEntity["QUOTE"] = "QUOTE";
    AuditEntity["INVOICE"] = "INVOICE";
    AuditEntity["PAYMENT"] = "PAYMENT";
    AuditEntity["MATERIAL"] = "MATERIAL";
    AuditEntity["ASSET"] = "ASSET";
    AuditEntity["MAINTENANCE_PLAN"] = "MAINTENANCE_PLAN";
    AuditEntity["MAINTENANCE_TASK"] = "MAINTENANCE_TASK";
    AuditEntity["MEETING"] = "MEETING";
    AuditEntity["RESOLUTION"] = "RESOLUTION";
    AuditEntity["VOTE"] = "VOTE";
    AuditEntity["DOCUMENT"] = "DOCUMENT";
    AuditEntity["NOTIFICATION"] = "NOTIFICATION";
    AuditEntity["SUBSCRIPTION"] = "SUBSCRIPTION";
    AuditEntity["USAGE_METRIC"] = "USAGE_METRIC";
    AuditEntity["SYSTEM"] = "SYSTEM";
})(AuditEntity || (exports.AuditEntity = AuditEntity = {}));
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["LOW"] = "LOW";
    AuditSeverity["MEDIUM"] = "MEDIUM";
    AuditSeverity["HIGH"] = "HIGH";
    AuditSeverity["CRITICAL"] = "CRITICAL";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
let AuditLog = class AuditLog extends base_entity_1.BaseEntity {
    adminId;
    actorUserId;
    action;
    entity;
    entityId;
    entityName;
    diff;
    ip;
    userAgent;
    sessionId;
    description;
    severity;
    metadata;
    requestId;
    correlationId;
    source;
    version;
    isSystemAction;
    isAutomated;
    automationRule;
    isSensitive;
    errorMessage;
    errorCode;
    duration;
    tags;
    retentionUntil;
    administration;
    actor;
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AuditLog.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "actorUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuditAction,
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuditEntity,
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "entity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "diff", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuditSeverity,
        default: AuditSeverity.LOW,
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "correlationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AuditLog.prototype, "isSystemAction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AuditLog.prototype, "isAutomated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "automationRule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AuditLog.prototype, "isSensitive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "errorCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AuditLog.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], AuditLog.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AuditLog.prototype, "retentionUntil", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], AuditLog.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'actorUserId' }),
    __metadata("design:type", user_entity_1.User)
], AuditLog.prototype, "actor", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('audit_logs'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['actorUserId']),
    (0, typeorm_1.Index)(['action']),
    (0, typeorm_1.Index)(['entity']),
    (0, typeorm_1.Index)(['entityId']),
    (0, typeorm_1.Index)(['severity']),
    (0, typeorm_1.Index)(['createdAt']),
    (0, typeorm_1.Index)(['adminId', 'entity', 'entityId']),
    (0, typeorm_1.Index)(['adminId', 'actorUserId'])
], AuditLog);
//# sourceMappingURL=audit-log.entity.js.map