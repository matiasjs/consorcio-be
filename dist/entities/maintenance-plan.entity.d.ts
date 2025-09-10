import { BaseEntity } from './base.entity';
import { Asset } from './asset.entity';
import { MaintenanceTask } from './maintenance-task.entity';
export declare enum MaintenanceFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    BIWEEKLY = "BIWEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMIANNUAL = "SEMIANNUAL",
    ANNUAL = "ANNUAL",
    BIANNUAL = "BIANNUAL",
    CUSTOM = "CUSTOM"
}
export declare enum PlanStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    COMPLETED = "COMPLETED"
}
export declare class MaintenancePlan extends BaseEntity {
    assetId: string;
    name: string;
    description?: string;
    frequency: MaintenanceFrequency;
    customFrequencyDays?: number;
    taskList: Array<{
        name: string;
        description: string;
        estimatedDurationMinutes?: number;
        requiredTools?: string[];
        requiredMaterials?: string[];
        safetyRequirements?: string[];
        instructions?: string;
    }>;
    slaHours?: number;
    status: PlanStatus;
    startDate?: Date;
    endDate?: Date;
    nextDueDate?: Date;
    lastCompletedDate?: Date;
    completedCount: number;
    overdueCount: number;
    estimatedCost?: number;
    currency: string;
    assignedVendorId?: string;
    assignedUserId?: string;
    notes?: string;
    requiresShutdown: boolean;
    shutdownInstructions?: string;
    requiresSpecialAccess: boolean;
    accessInstructions?: string;
    documents?: Array<{
        filename: string;
        url: string;
        description?: string;
    }>;
    asset: Asset;
    tasks: MaintenanceTask[];
}
