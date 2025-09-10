import { BaseEntity } from './base.entity';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';
export declare enum InspectionStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    RESCHEDULED = "RESCHEDULED"
}
export declare enum InspectionRecommendation {
    NO_ACTION = "NO_ACTION",
    MINOR_REPAIR = "MINOR_REPAIR",
    MAJOR_REPAIR = "MAJOR_REPAIR",
    REPLACEMENT = "REPLACEMENT",
    EMERGENCY_ACTION = "EMERGENCY_ACTION",
    FURTHER_INSPECTION = "FURTHER_INSPECTION"
}
export declare class Inspection extends BaseEntity {
    ticketId: string;
    inspectorUserId: string;
    scheduledAt: Date;
    visitedAt?: Date;
    notes?: string;
    photos?: Array<{
        filename: string;
        url: string;
        description?: string;
        timestamp: Date;
    }>;
    recommendation?: InspectionRecommendation;
    status: InspectionStatus;
    findings?: string;
    estimatedRepairCost?: number;
    currency: string;
    estimatedDurationHours?: number;
    requiresSpecialist: boolean;
    specialistType?: string;
    safetyRisk: boolean;
    safetyNotes?: string;
    ticket: Ticket;
    inspector: User;
}
