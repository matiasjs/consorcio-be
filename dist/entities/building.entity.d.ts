import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { Unit } from './unit.entity';
export declare class Building extends BaseEntity {
    adminId: string;
    name: string;
    address: string;
    city: string;
    country: string;
    notes?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    totalFloors?: number;
    totalUnits?: number;
    isActive: boolean;
    administration: Administration;
    units: Unit[];
}
