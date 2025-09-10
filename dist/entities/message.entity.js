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
exports.Message = exports.EntityType = exports.MessageChannel = exports.MessageDirection = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const ticket_entity_1 = require("./ticket.entity");
const user_entity_1 = require("./user.entity");
var MessageDirection;
(function (MessageDirection) {
    MessageDirection["INBOUND"] = "INBOUND";
    MessageDirection["OUTBOUND"] = "OUTBOUND";
    MessageDirection["INTERNAL"] = "INTERNAL";
})(MessageDirection || (exports.MessageDirection = MessageDirection = {}));
var MessageChannel;
(function (MessageChannel) {
    MessageChannel["WEB"] = "WEB";
    MessageChannel["MOBILE"] = "MOBILE";
    MessageChannel["EMAIL"] = "EMAIL";
    MessageChannel["WHATSAPP"] = "WHATSAPP";
    MessageChannel["SMS"] = "SMS";
    MessageChannel["PHONE"] = "PHONE";
    MessageChannel["SYSTEM"] = "SYSTEM";
})(MessageChannel || (exports.MessageChannel = MessageChannel = {}));
var EntityType;
(function (EntityType) {
    EntityType["TICKET"] = "TICKET";
    EntityType["WORK_ORDER"] = "WORK_ORDER";
    EntityType["INSPECTION"] = "INSPECTION";
    EntityType["MEETING"] = "MEETING";
    EntityType["BUILDING"] = "BUILDING";
    EntityType["UNIT"] = "UNIT";
})(EntityType || (exports.EntityType = EntityType = {}));
let Message = class Message extends base_entity_1.BaseEntity {
    entityType;
    entityId;
    authorUserId;
    direction;
    channel;
    body;
    attachments;
    isRead;
    readAt;
    readByUserId;
    subject;
    fromEmail;
    toEmail;
    fromPhone;
    toPhone;
    externalId;
    metadata;
    author;
    readByUser;
    ticket;
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EntityType,
    }),
    __metadata("design:type", String)
], Message.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Message.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "authorUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageDirection,
    }),
    __metadata("design:type", String)
], Message.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageChannel,
    }),
    __metadata("design:type", String)
], Message.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Message.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Message.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Message.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "readByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "fromEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "toEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "fromPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "toPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Message.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'authorUserId' }),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'readByUserId' }),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "readByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_entity_1.Ticket, (ticket) => ticket.messages),
    (0, typeorm_1.JoinColumn)({ name: 'entityId' }),
    __metadata("design:type", ticket_entity_1.Ticket)
], Message.prototype, "ticket", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)('messages'),
    (0, typeorm_1.Index)(['entityType', 'entityId']),
    (0, typeorm_1.Index)(['authorUserId']),
    (0, typeorm_1.Index)(['direction']),
    (0, typeorm_1.Index)(['channel'])
], Message);
//# sourceMappingURL=message.entity.js.map