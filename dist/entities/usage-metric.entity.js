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
exports.UsageMetric = exports.MetricPeriod = exports.MetricType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const administration_entity_1 = require("./administration.entity");
const subscription_entity_1 = require("./subscription.entity");
var MetricType;
(function (MetricType) {
    MetricType["UNITS_COUNT"] = "UNITS_COUNT";
    MetricType["USERS_COUNT"] = "USERS_COUNT";
    MetricType["TICKETS_COUNT"] = "TICKETS_COUNT";
    MetricType["STORAGE_USED"] = "STORAGE_USED";
    MetricType["API_CALLS"] = "API_CALLS";
    MetricType["NOTIFICATIONS_SENT"] = "NOTIFICATIONS_SENT";
    MetricType["DOCUMENTS_UPLOADED"] = "DOCUMENTS_UPLOADED";
    MetricType["MEETINGS_CREATED"] = "MEETINGS_CREATED";
    MetricType["WORK_ORDERS_CREATED"] = "WORK_ORDERS_CREATED";
    MetricType["INVOICES_PROCESSED"] = "INVOICES_PROCESSED";
    MetricType["ACTIVE_SESSIONS"] = "ACTIVE_SESSIONS";
    MetricType["BANDWIDTH_USED"] = "BANDWIDTH_USED";
    MetricType["CUSTOM"] = "CUSTOM";
})(MetricType || (exports.MetricType = MetricType = {}));
var MetricPeriod;
(function (MetricPeriod) {
    MetricPeriod["DAILY"] = "DAILY";
    MetricPeriod["WEEKLY"] = "WEEKLY";
    MetricPeriod["MONTHLY"] = "MONTHLY";
    MetricPeriod["QUARTERLY"] = "QUARTERLY";
    MetricPeriod["ANNUAL"] = "ANNUAL";
})(MetricPeriod || (exports.MetricPeriod = MetricPeriod = {}));
let UsageMetric = class UsageMetric extends base_entity_1.BaseEntity {
    adminId;
    subscriptionId;
    metric;
    period;
    periodStart;
    periodEnd;
    value;
    unit;
    limit;
    usagePercentage;
    isOverLimit;
    previousValue;
    changePercentage;
    peakValue;
    peakValueAt;
    averageValue;
    breakdown;
    notes;
    metadata;
    isEstimated;
    calculatedAt;
    calculationMethod;
    isAggregated;
    sourceMetricIds;
    administration;
    subscription;
};
exports.UsageMetric = UsageMetric;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UsageMetric.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], UsageMetric.prototype, "subscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MetricType,
    }),
    __metadata("design:type", String)
], UsageMetric.prototype, "metric", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MetricPeriod,
    }),
    __metadata("design:type", String)
], UsageMetric.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], UsageMetric.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], UsageMetric.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], UsageMetric.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "usagePercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UsageMetric.prototype, "isOverLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "previousValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "changePercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "peakValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UsageMetric.prototype, "peakValueAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], UsageMetric.prototype, "averageValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], UsageMetric.prototype, "breakdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UsageMetric.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], UsageMetric.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UsageMetric.prototype, "isEstimated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UsageMetric.prototype, "calculatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UsageMetric.prototype, "calculationMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UsageMetric.prototype, "isAggregated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], UsageMetric.prototype, "sourceMetricIds", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], UsageMetric.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_entity_1.Subscription),
    (0, typeorm_1.JoinColumn)({ name: 'subscriptionId' }),
    __metadata("design:type", subscription_entity_1.Subscription)
], UsageMetric.prototype, "subscription", void 0);
exports.UsageMetric = UsageMetric = __decorate([
    (0, typeorm_1.Entity)('usage_metrics'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['subscriptionId']),
    (0, typeorm_1.Index)(['metric']),
    (0, typeorm_1.Index)(['period']),
    (0, typeorm_1.Index)(['periodStart']),
    (0, typeorm_1.Index)(['periodEnd'])
], UsageMetric);
//# sourceMappingURL=usage-metric.entity.js.map