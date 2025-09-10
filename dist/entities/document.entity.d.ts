import { Administration } from './administration.entity';
import { BaseEntity } from './base.entity';
import { Building } from './building.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';
export declare enum DocumentType {
    BYLAW = "BYLAW",
    REGULATION = "REGULATION",
    FINANCIAL_REPORT = "FINANCIAL_REPORT",
    MEETING_MINUTES = "MEETING_MINUTES",
    INSURANCE = "INSURANCE",
    CONTRACT = "CONTRACT",
    INVOICE = "INVOICE",
    RECEIPT = "RECEIPT",
    CERTIFICATE = "CERTIFICATE",
    PERMIT = "PERMIT",
    MANUAL = "MANUAL",
    WARRANTY = "WARRANTY",
    PHOTO = "PHOTO",
    PLAN = "PLAN",
    LEGAL = "LEGAL",
    OTHER = "OTHER"
}
export declare enum DocumentStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    EXPIRED = "EXPIRED",
    SUPERSEDED = "SUPERSEDED"
}
export declare class Document extends BaseEntity {
    adminId: string;
    buildingId?: string;
    unitId?: string;
    type: DocumentType;
    title: string;
    description?: string;
    category?: string;
    fileUrl: string;
    filename: string;
    mimeType: string;
    fileSize: number;
    status: DocumentStatus;
    uploadedByUserId: string;
    uploadedAt?: Date;
    effectiveDate?: Date;
    expiryDate?: Date;
    version?: string;
    supersededByDocumentId?: string;
    supersedesDocumentId?: string;
    tags?: string[];
    notes?: string;
    isPublic: boolean;
    requiresSignature: boolean;
    signatures?: Array<{
        userId: string;
        signedAt: Date;
        ipAddress?: string;
        digitalSignature?: string;
    }>;
    isEncrypted: boolean;
    encryptionKey?: string;
    downloadCount: number;
    lastAccessedAt?: Date;
    lastAccessedByUserId?: string;
    accessLog?: Array<{
        userId: string;
        accessedAt: Date;
        action: string;
        ipAddress?: string;
    }>;
    checksum?: string;
    administration: Administration;
    building?: Building;
    unit?: Unit;
    uploadedByUser: User;
    lastAccessedByUser?: User;
    supersededByDocument?: Document;
    supersedesDocument?: Document;
}
