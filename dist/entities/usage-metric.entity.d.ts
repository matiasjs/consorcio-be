import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { Subscription } from './subscription.entity';
export declare enum MetricType {
    UNITS_COUNT = "UNITS_COUNT",
    USERS_COUNT = "USERS_COUNT",
    TICKETS_COUNT = "TICKETS_COUNT",
    STORAGE_USED = "STORAGE_USED",
    API_CALLS = "API_CALLS",
    NOTIFICATIONS_SENT = "NOTIFICATIONS_SENT",
    DOCUMENTS_UPLOADED = "DOCUMENTS_UPLOADED",
    MEETINGS_CREATED = "MEETINGS_CREATED",
    WORK_ORDERS_CREATED = "WORK_ORDERS_CREATED",
    INVOICES_PROCESSED = "INVOICES_PROCESSED",
    ACTIVE_SESSIONS = "ACTIVE_SESSIONS",
    BANDWIDTH_USED = "BANDWIDTH_USED",
    CUSTOM = "CUSTOM"
}
export declare enum MetricPeriod {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUAL = "ANNUAL"
}
export declare class UsageMetric extends BaseEntity {
    adminId: string;
    subscriptionId?: string;
    metric: MetricType;
    period: MetricPeriod;
    periodStart: Date;
    periodEnd: Date;
    value: number;
    unit?: string;
    limit?: number;
    usagePercentage?: number;
    isOverLimit: boolean;
    previousValue?: number;
    changePercentage?: number;
    peakValue?: number;
    peakValueAt?: Date;
    averageValue?: number;
    breakdown?: Record<string, number>;
    notes?: string;
    metadata?: Record<string, any>;
    isEstimated: boolean;
    calculatedAt?: Date;
    calculationMethod?: string;
    isAggregated: boolean;
    sourceMetricIds?: string[];
    administration: Administration;
    subscription?: Subscription;
}
