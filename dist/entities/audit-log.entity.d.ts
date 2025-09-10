import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { User } from './user.entity';
export declare enum AuditAction {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    EXPORT = "EXPORT",
    IMPORT = "IMPORT",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    ASSIGN = "ASSIGN",
    UNASSIGN = "UNASSIGN",
    ACTIVATE = "ACTIVATE",
    DEACTIVATE = "DEACTIVATE",
    SUSPEND = "SUSPEND",
    RESTORE = "RESTORE",
    ARCHIVE = "ARCHIVE",
    PUBLISH = "PUBLISH",
    UNPUBLISH = "UNPUBLISH",
    SEND = "SEND",
    RECEIVE = "RECEIVE",
    UPLOAD = "UPLOAD",
    DOWNLOAD = "DOWNLOAD",
    SHARE = "SHARE",
    UNSHARE = "UNSHARE",
    VOTE = "VOTE",
    SCHEDULE = "SCHEDULE",
    RESCHEDULE = "RESCHEDULE",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    CUSTOM = "CUSTOM"
}
export declare enum AuditEntity {
    ADMINISTRATION = "ADMINISTRATION",
    USER = "USER",
    BUILDING = "BUILDING",
    UNIT = "UNIT",
    VENDOR = "VENDOR",
    TICKET = "TICKET",
    INSPECTION = "INSPECTION",
    WORK_ORDER = "WORK_ORDER",
    QUOTE = "QUOTE",
    INVOICE = "INVOICE",
    PAYMENT = "PAYMENT",
    MATERIAL = "MATERIAL",
    ASSET = "ASSET",
    MAINTENANCE_PLAN = "MAINTENANCE_PLAN",
    MAINTENANCE_TASK = "MAINTENANCE_TASK",
    MEETING = "MEETING",
    RESOLUTION = "RESOLUTION",
    VOTE = "VOTE",
    DOCUMENT = "DOCUMENT",
    NOTIFICATION = "NOTIFICATION",
    SUBSCRIPTION = "SUBSCRIPTION",
    USAGE_METRIC = "USAGE_METRIC",
    SYSTEM = "SYSTEM"
}
export declare enum AuditSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare class AuditLog extends BaseEntity {
    adminId: string;
    actorUserId?: string;
    action: AuditAction;
    entity: AuditEntity;
    entityId?: string;
    entityName?: string;
    diff?: {
        before?: Record<string, any>;
        after?: Record<string, any>;
        changes?: Array<{
            field: string;
            oldValue: any;
            newValue: any;
        }>;
    };
    ip?: string;
    userAgent?: string;
    sessionId?: string;
    description?: string;
    severity: AuditSeverity;
    metadata?: Record<string, any>;
    requestId?: string;
    correlationId?: string;
    source?: string;
    version?: string;
    isSystemAction: boolean;
    isAutomated: boolean;
    automationRule?: string;
    isSensitive: boolean;
    errorMessage?: string;
    errorCode?: string;
    duration?: number;
    tags?: string[];
    retentionUntil?: Date;
    administration: Administration;
    actor?: User;
}
