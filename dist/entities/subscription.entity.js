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
exports.Subscription = exports.BillingCycle = exports.SubscriptionStatus = exports.SubscriptionPlan = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const administration_entity_1 = require("./administration.entity");
const usage_metric_entity_1 = require("./usage-metric.entity");
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["BASIC"] = "BASIC";
    SubscriptionPlan["STANDARD"] = "STANDARD";
    SubscriptionPlan["PREMIUM"] = "PREMIUM";
    SubscriptionPlan["ENTERPRISE"] = "ENTERPRISE";
    SubscriptionPlan["CUSTOM"] = "CUSTOM";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["INACTIVE"] = "INACTIVE";
    SubscriptionStatus["SUSPENDED"] = "SUSPENDED";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["TRIAL"] = "TRIAL";
    SubscriptionStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "MONTHLY";
    BillingCycle["QUARTERLY"] = "QUARTERLY";
    BillingCycle["SEMIANNUAL"] = "SEMIANNUAL";
    BillingCycle["ANNUAL"] = "ANNUAL";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
let Subscription = class Subscription extends base_entity_1.BaseEntity {
    adminId;
    plan;
    unitsQuota;
    priceMonth;
    currency;
    renewsAt;
    expiresAt;
    status;
    billingCycle;
    trialStartDate;
    trialEndDate;
    isTrialUsed;
    features;
    discountAmount;
    discountPercentage;
    discountCode;
    discountExpiresAt;
    notes;
    paymentMethodId;
    externalSubscriptionId;
    lastBilledAt;
    nextBillingAt;
    totalPaid;
    billingCycleCount;
    autoRenew;
    cancellationReason;
    cancelledAt;
    cancelledByUserId;
    suspensionReason;
    suspendedAt;
    suspendedByUserId;
    administration;
    usageMetrics;
};
exports.Subscription = Subscription;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Subscription.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SubscriptionPlan,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Subscription.prototype, "unitsQuota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Subscription.prototype, "priceMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'ARS' }),
    __metadata("design:type", String)
], Subscription.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Subscription.prototype, "renewsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BillingCycle,
        default: BillingCycle.MONTHLY,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "billingCycle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isTrialUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Subscription.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Subscription.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Subscription.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "discountCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "discountExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentMethodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "externalSubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "lastBilledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "nextBillingAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "totalPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "billingCycleCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "autoRenew", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "cancelledByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "suspensionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "suspendedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "suspendedByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administration_entity_1.Administration),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", administration_entity_1.Administration)
], Subscription.prototype, "administration", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usage_metric_entity_1.UsageMetric, (metric) => metric.subscription),
    __metadata("design:type", Array)
], Subscription.prototype, "usageMetrics", void 0);
exports.Subscription = Subscription = __decorate([
    (0, typeorm_1.Entity)('subscriptions'),
    (0, typeorm_1.Index)(['adminId']),
    (0, typeorm_1.Index)(['plan']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['renewsAt']),
    (0, typeorm_1.Index)(['expiresAt'])
], Subscription);
//# sourceMappingURL=subscription.entity.js.map