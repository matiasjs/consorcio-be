import { BaseEntity } from './base.entity';
import { WorkOrderMaterial } from './work-order-material.entity';
export declare enum MaterialUnit {
    PIECE = "PIECE",
    METER = "METER",
    SQUARE_METER = "SQUARE_METER",
    CUBIC_METER = "CUBIC_METER",
    KILOGRAM = "KILOGRAM",
    LITER = "LITER",
    HOUR = "HOUR",
    DAY = "DAY",
    PACKAGE = "PACKAGE",
    BOX = "BOX",
    ROLL = "ROLL",
    TUBE = "TUBE",
    BAG = "BAG"
}
export declare enum MaterialCategory {
    PLUMBING = "PLUMBING",
    ELECTRICAL = "ELECTRICAL",
    PAINTING = "PAINTING",
    CONSTRUCTION = "CONSTRUCTION",
    HARDWARE = "HARDWARE",
    CLEANING = "CLEANING",
    SAFETY = "SAFETY",
    TOOLS = "TOOLS",
    LABOR = "LABOR",
    OTHER = "OTHER"
}
export declare class MaterialItem extends BaseEntity {
    adminId: string;
    name: string;
    sku?: string;
    unit: MaterialUnit;
    defaultCost?: number;
    currency: string;
    category: MaterialCategory;
    description?: string;
    brand?: string;
    model?: string;
    specifications?: string;
    supplier?: string;
    supplierCode?: string;
    minimumStock?: number;
    currentStock?: number;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
        unit: string;
    };
    isActive: boolean;
    notes?: string;
    workOrderMaterials: WorkOrderMaterial[];
}
