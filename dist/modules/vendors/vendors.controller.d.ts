import { User } from '../../entities/user.entity';
import { CreateVendorAvailabilityDto, CreateVendorDto, UpdateVendorAvailabilityDto, UpdateVendorDto } from './dto';
import { VendorsService } from './vendors.service';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(createVendorDto: CreateVendorDto, currentUser: User): Promise<import("../../entities").Vendor>;
    findAll(currentUser: User, trade?: string): Promise<import("../../entities").Vendor[]>;
    findOne(id: string, currentUser: User): Promise<import("../../entities").Vendor>;
    update(id: string, updateVendorDto: UpdateVendorDto, currentUser: User): Promise<import("../../entities").Vendor>;
    remove(id: string, currentUser: User): Promise<void>;
    createAvailability(id: string, createAvailabilityDto: CreateVendorAvailabilityDto, currentUser: User): Promise<import("../../entities").VendorAvailability>;
    getAvailability(id: string, currentUser: User): Promise<import("../../entities").VendorAvailability[]>;
    updateAvailability(id: string, availabilityId: string, updateAvailabilityDto: UpdateVendorAvailabilityDto, currentUser: User): Promise<import("../../entities").VendorAvailability>;
    removeAvailability(id: string, availabilityId: string, currentUser: User): Promise<void>;
}
