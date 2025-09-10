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
exports.Document = exports.DocumentStatus = exports.DocumentType = void 0;
const typeorm_1 = require("typeorm");
const administration_entity_1 = require("./administration.entity");
const base_entity_1 = require("./base.entity");
const building_entity_1 = require("./building.entity");
const unit_entity_1 = require("./unit.entity");
const user_entity_1 = require("./user.entity");
var DocumentType;
(function (DocumentType) {
    DocumentType["BYLAW"] = "BYLAW";
    DocumentType["REGULATION"] = "REGULATION";
    DocumentType["FINANCIAL_REPORT"] = "FINANCIAL_REPORT";
    DocumentType["MEETING_MINUTES"] = "MEETING_MINUTES";
    DocumentType["INSURANCE"] = "INSURANCE";
    DocumentType["CONTRACT"] = "CONTRACT";
    DocumentType["INVOICE"] = "INVOICE";
    DocumentType["RECEIPT"] = "RECEIPT";
    DocumentType["CERTIFICATE"] = "CERTIFICATE";
    DocumentType["PERMIT"] = "PERMIT";
    DocumentType["MANUAL"] = "MANUAL";
    DocumentType["WARRANTY"] = "WARRANTY";
    DocumentType["PHOTO"] = "PHOTO";
    DocumentType["PLAN"] = "PLAN";
    DocumentType["LEGAL"] = "LEGAL";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "DRAFT";
    DocumentStatus["ACTIVE"] = "ACTIVE";
    DocumentStatus["ARCHIVED"] = "ARCHIVED";
    DocumentStatus["EXPIRED"] = "EXPIRED";
    DocumentStatus["SUPERSEDED"] = "SUPERSEDED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let Document = class Document extends base_entity_1.BaseEntity {
    adminId;
    buildingId;
    unitId;
    type;
    title;
    description;
    category;
    fileUrl;
    filename;
    mimeType;
    fileSize;
    status;
    uploadedByUserId;
    uploadedAt;
    effectiveDate;
    expiryDate;
    version;
    supersededByDocumentId;
    supersedesDocumentId;
    tags;
    notes;
    isPublic;
    requiresSignature;
    signatures;
    isEncrypted;
    encryptionKey;
    downloadCount;
    lastAccessedAt;
    lastAccessedByUserId;
    accessLog;
    checksum;
    administration;
    building;
    unit;
    uploadedByUser;
    lastAccessedByUser;
    supersededByDocument;
    supersedesDocument;
};
exports.Document = Document;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Document.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "buildingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentType,
    }),
    __metadata("design:type", String)
], Document.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Document.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Document.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Document.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Document.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Document.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentStatus,
        default: DocumentStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Document.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Document.prototype, "uploadedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "effectiveDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "supersededByDocumentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "supersedesDocumentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Document.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Document.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Document.prototype, "requiresSignature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Document.prototype, "signatures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Document.prototype, "isEncrypted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "encryptionKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Document.prototype, "downloadCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "lastAccessedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "lastAccessedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Document.prototype, "accessLog", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "checksum", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], Document.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => building_entity_1.Building),
    (0, typeorm_1.JoinColumn)({ name: 'buildingId' }),
    __metadata("design:type", building_entity_1.Building)
], Document.prototype, "building", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit),
    (0, typeorm_1.JoinColumn)({ name: 'unitId' }),
    __metadata("design:type", unit_entity_1.Unit)
], Document.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'uploadedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], Document.prototype, "uploadedByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'lastAccessedByUserId' }),
    __metadata("design:type", user_entity_1.User)
], Document.prototype, "lastAccessedByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Document),
    (0, typeorm_1.JoinColumn)({ name: 'supersededByDocumentId' }),
    __metadata("design:type", Document)
], Document.prototype, "supersededByDocument", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Document),
    (0, typeorm_1.JoinColumn)({ name: 'supersedesDocumentId' }),
    __metadata("design:type", Document)
], Document.prototype, "supersedesDocument", void 0);
exports.Document = Document = __decorate([
    (0, typeorm_1.Entity)('documents'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['buildingId']),
    (0, typeorm_1.Index)(['unitId']),
    (0, typeorm_1.Index)(['type']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['uploadedByUserId'])
], Document);
//# sourceMappingURL=document.entity.js.map