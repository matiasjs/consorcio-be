import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';
import { MaterialItem } from './material-item.entity';
export declare class WorkOrderMaterial extends BaseEntity {
    workOrderId: string;
    materialItemId: string;
    qty: number;
    unitCost?: number;
    currency: string;
    supplierName?: string;
    notes?: string;
    actualQtyUsed?: number;
    actualCost?: number;
    isSuppliedByVendor: boolean;
    isSuppliedByClient: boolean;
    deliveryDate?: Date;
    deliveryNotes?: string;
    invoiceReference?: string;
    workOrder: WorkOrder;
    materialItem: MaterialItem;
}
