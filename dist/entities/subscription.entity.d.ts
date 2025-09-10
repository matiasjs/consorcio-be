import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { UsageMetric } from './usage-metric.entity';
export declare enum SubscriptionPlan {
    BASIC = "BASIC",
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    ENTERPRISE = "ENTERPRISE",
    CUSTOM = "CUSTOM"
}
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    TRIAL = "TRIAL",
    PENDING_PAYMENT = "PENDING_PAYMENT"
}
export declare enum BillingCycle {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMIANNUAL = "SEMIANNUAL",
    ANNUAL = "ANNUAL"
}
export declare class Subscription extends BaseEntity {
    adminId: string;
    plan: SubscriptionPlan;
    unitsQuota: number;
    priceMonth: number;
    currency: string;
    renewsAt: Date;
    expiresAt?: Date;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    trialStartDate?: Date;
    trialEndDate?: Date;
    isTrialUsed: boolean;
    features?: Array<{
        name: string;
        enabled: boolean;
        limit?: number;
    }>;
    discountAmount?: number;
    discountPercentage?: number;
    discountCode?: string;
    discountExpiresAt?: Date;
    notes?: string;
    paymentMethodId?: string;
    externalSubscriptionId?: string;
    lastBilledAt?: Date;
    nextBillingAt?: Date;
    totalPaid: number;
    billingCycleCount: number;
    autoRenew: boolean;
    cancellationReason?: string;
    cancelledAt?: Date;
    cancelledByUserId?: string;
    suspensionReason?: string;
    suspendedAt?: Date;
    suspendedByUserId?: string;
    administration: Administration;
    usageMetrics: UsageMetric[];
}
