import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';
export declare enum ScheduleSlotStatus {
    PROPOSED = "PROPOSED",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare enum ProposedBy {
    VENDOR = "VENDOR",
    ADMINISTRATION = "ADMINISTRATION",
    SYSTEM = "SYSTEM"
}
export declare class ScheduleSlot extends BaseEntity {
    workOrderId: string;
    proposedBy: ProposedBy;
    start: Date;
    end: Date;
    startDate: Date;
    endDate: Date;
    status: ScheduleSlotStatus;
    notes?: string;
    rejectionReason?: string;
    confirmedByUserId?: string;
    confirmedAt?: Date;
    requiresAccess: boolean;
    accessInstructions?: string;
    contactPhone?: string;
    specialRequirements?: string;
    workOrder: WorkOrder;
}
