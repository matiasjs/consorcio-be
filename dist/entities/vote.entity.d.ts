import { BaseEntity } from './base.entity';
import { Resolution } from './resolution.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';
export declare enum VoteChoice {
    FOR = "FOR",
    AGAINST = "AGAINST",
    ABSTAIN = "ABSTAIN"
}
export declare enum VoteType {
    DIRECT = "DIRECT",
    PROXY = "PROXY",
    ELECTRONIC = "ELECTRONIC"
}
export declare class Vote extends BaseEntity {
    resolutionId: string;
    unitId: string;
    voterUserId?: string;
    userId: string;
    choice: VoteChoice;
    weight: number;
    type: VoteType;
    proxyFromUserId?: string;
    proxyDocument?: string;
    comments?: string;
    votedAt?: Date;
    ipAddress?: string;
    userAgent?: string;
    isVerified: boolean;
    verifiedAt?: Date;
    verifiedByUserId?: string;
    verificationNotes?: string;
    isContested: boolean;
    contestReason?: string;
    contestedAt?: Date;
    contestedByUserId?: string;
    metadata?: Record<string, any>;
    resolution: Resolution;
    unit: Unit;
    voter?: User;
    proxyFromUser?: User;
    verifiedByUser?: User;
    contestedByUser?: User;
}
