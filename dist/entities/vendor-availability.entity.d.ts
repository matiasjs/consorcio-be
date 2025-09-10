import { BaseEntity } from './base.entity';
import { Vendor } from './vendor.entity';
export declare enum Weekday {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}
export declare class VendorAvailability extends BaseEntity {
    vendorId: string;
    weekday: Weekday;
    from: string;
    to: string;
    exceptions?: Array<{
        date: string;
        from?: string;
        to?: string;
        unavailable?: boolean;
        reason?: string;
    }>;
    isActive: boolean;
    vendor: Vendor;
}
