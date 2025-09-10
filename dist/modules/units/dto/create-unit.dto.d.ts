export declare enum UnitType {
    APARTMENT = "apartment",
    STORE = "store",
    GARAGE = "garage"
}
export declare class CreateUnitDto {
    buildingId: string;
    label: string;
    type: UnitType;
    floor: number;
    m2: number;
    isRented?: boolean;
}
