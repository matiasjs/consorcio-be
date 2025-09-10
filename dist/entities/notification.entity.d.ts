import { BaseEntity } from './base.entity';
import { User } from './user.entity';
export declare enum NotificationChannel {
    WEB = "WEB",
    EMAIL = "EMAIL",
    SMS = "SMS",
    WHATSAPP = "WHATSAPP",
    PUSH = "PUSH",
    IN_APP = "IN_APP"
}
export declare enum NotificationStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare enum NotificationType {
    TICKET_CREATED = "TICKET_CREATED",
    TICKET_UPDATED = "TICKET_UPDATED",
    TICKET_COMPLETED = "TICKET_COMPLETED",
    INSPECTION_SCHEDULED = "INSPECTION_SCHEDULED",
    WORK_ORDER_ASSIGNED = "WORK_ORDER_ASSIGNED",
    PAYMENT_DUE = "PAYMENT_DUE",
    MEETING_SCHEDULED = "MEETING_SCHEDULED",
    MEETING_REMINDER = "MEETING_REMINDER",
    VOTE_REQUIRED = "VOTE_REQUIRED",
    MAINTENANCE_DUE = "MAINTENANCE_DUE",
    DOCUMENT_SHARED = "DOCUMENT_SHARED",
    EMERGENCY = "EMERGENCY",
    GENERAL = "GENERAL",
    SYSTEM = "SYSTEM"
}
export declare enum NotificationPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
    EMERGENCY = "EMERGENCY"
}
export declare class Notification extends BaseEntity {
    adminId: string;
    userId?: string;
    targetUserId?: string;
    targetBuildingId?: string;
    sentByUserId?: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
    isRead: boolean;
    isHighPriority: boolean;
    message?: string;
    title: string;
    body: string;
    channel: NotificationChannel;
    status: NotificationStatus;
    type: NotificationType;
    priority: NotificationPriority;
    scheduledFor?: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    expiresAt?: Date;
    data?: Record<string, any>;
    actionUrl?: string;
    actionText?: string;
    imageUrl?: string;
    iconUrl?: string;
    metadata?: Record<string, any>;
    failureReason?: string;
    retryCount: number;
    maxRetries: number;
    nextRetryAt?: Date;
    externalId?: string;
    templateId?: string;
    templateData?: Record<string, any>;
    isGrouped: boolean;
    groupId?: string;
    entityType?: string;
    entityId?: string;
    user: User;
}
