import { BaseEntity } from './base.entity';
import { MaintenancePlan } from './maintenance-plan.entity';
import { User } from './user.entity';
import { Vendor } from './vendor.entity';
export declare enum TaskStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    OVERDUE = "OVERDUE",
    RESCHEDULED = "RESCHEDULED"
}
export declare enum PerformedByType {
    USER = "USER",
    VENDOR = "VENDOR"
}
export declare class MaintenanceTask extends BaseEntity {
    planId: string;
    title: string;
    description?: string;
    scheduledFor: Date;
    scheduledDate: Date;
    status: TaskStatus;
    performedByType?: PerformedByType;
    performedByUserId?: string;
    performedByVendorId?: string;
    startedAt?: Date;
    completedAt?: Date;
    actualDurationMinutes?: number;
    notes?: string;
    evidencePhotos?: Array<{
        filename: string;
        url: string;
        description?: string;
        timestamp: Date;
    }>;
    completedTasks?: Array<{
        name: string;
        completed: boolean;
        notes?: string;
    }>;
    findings?: string;
    recommendations?: string;
    requiresFollowUp: boolean;
    followUpDate?: Date;
    followUpNotes?: string;
    actualCost?: number;
    currency: string;
    materialsUsed?: Array<{
        name: string;
        quantity: number;
        unit: string;
        cost?: number;
    }>;
    qualityRating?: number;
    qualityFeedback?: string;
    cancellationReason?: string;
    rescheduledFrom?: Date;
    rescheduleReason?: string;
    plan: MaintenancePlan;
    performedByUser?: User;
    performedByVendor?: Vendor;
}
