import { PlanTier } from '../../../entities/administration.entity';
export declare class CreateAdministrationDto {
    name: string;
    cuit: string;
    email: string;
    phone?: string;
    address?: string;
    planTier?: PlanTier;
}
