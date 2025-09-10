import { Administration } from './administration.entity';
import { BaseEntity } from './base.entity';
import { Building } from './building.entity';
import { Resolution } from './resolution.entity';
export declare enum MeetingStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED"
}
export declare enum MeetingType {
    ORDINARY = "ORDINARY",
    EXTRAORDINARY = "EXTRAORDINARY",
    EMERGENCY = "EMERGENCY",
    BOARD = "BOARD",
    COMMITTEE = "COMMITTEE"
}
export declare class Meeting extends BaseEntity {
    adminId: string;
    buildingId: string;
    title: string;
    description?: string;
    scheduledAt: Date;
    scheduledDate: Date;
    location?: string;
    agenda?: Array<{
        order: number;
        title: string;
        description?: string;
        estimatedDurationMinutes?: number;
        presenter?: string;
    }>;
    documents?: Array<{
        filename: string;
        url: string;
        description?: string;
        type: string;
    }>;
    status: MeetingStatus;
    type: MeetingType;
    minutes?: string;
    startedAt?: Date;
    endedAt?: Date;
    expectedAttendees?: number;
    actualAttendees?: number;
    quorumPercentage?: number;
    quorumReached: boolean;
    chairpersonUserId?: string;
    secretaryUserId?: string;
    notes?: string;
    attendees?: Array<{
        userId?: string;
        unitId?: string;
        name: string;
        role: string;
        present: boolean;
        proxy?: string;
        votingWeight?: number;
    }>;
    cancellationReason?: string;
    rescheduledFrom?: Date;
    rescheduleReason?: string;
    recordings?: Array<{
        filename: string;
        url: string;
        duration?: number;
        format: string;
    }>;
    administration: Administration;
    building: Building;
    resolutions: Resolution[];
}
