export declare enum Weekday {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday"
}
export declare class CreateVendorAvailabilityDto {
    weekday: Weekday;
    from: string;
    to: string;
}
