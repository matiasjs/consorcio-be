import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { VendorAvailability } from './vendor-availability.entity';
export declare class Vendor extends BaseEntity {
    adminId: string;
    legalName: string;
    trade: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    ratingAvg: number;
    ratingCount: number;
    isPreferred: boolean;
    cuit?: string;
    website?: string;
    description?: string;
    certifications?: string[];
    serviceAreas?: string[];
    isActive: boolean;
    administration: Administration;
    availabilities: VendorAvailability[];
}
