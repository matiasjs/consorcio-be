import { BaseEntity } from './base.entity';
import { Meeting } from './meeting.entity';
import { Vote } from './vote.entity';
export declare enum ResolutionStatus {
    DRAFT = "DRAFT",
    PROPOSED = "PROPOSED",
    VOTING = "VOTING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN",
    DEFERRED = "DEFERRED"
}
export declare enum ResolutionType {
    ORDINARY = "ORDINARY",
    SPECIAL = "SPECIAL",
    FINANCIAL = "FINANCIAL",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    MAINTENANCE = "MAINTENANCE",
    BYLAW_CHANGE = "BYLAW_CHANGE"
}
export declare class Resolution extends BaseEntity {
    meetingId: string;
    title: string;
    description: string;
    requiresVote: boolean;
    status: ResolutionStatus;
    type: ResolutionType;
    orderInMeeting?: number;
    requiredMajority?: number;
    votingStartedAt?: Date;
    votingEndedAt?: Date;
    votesFor: number;
    votesAgainst: number;
    votesAbstain: number;
    totalVotingWeight: number;
    weightFor: number;
    weightAgainst: number;
    weightAbstain: number;
    approvalPercentage?: number;
    rationale?: string;
    financialImpact?: string;
    estimatedCost?: number;
    currency: string;
    implementationDate?: Date;
    implementationNotes?: string;
    proposedByUserId?: string;
    proposedAt?: Date;
    rejectionReason?: string;
    withdrawalReason?: string;
    attachments?: Array<{
        filename: string;
        url: string;
        description?: string;
    }>;
    legalReferences?: string;
    requiresUnanimity: boolean;
    isUrgent: boolean;
    urgencyReason?: string;
    meeting: Meeting;
    votes: Vote[];
}
