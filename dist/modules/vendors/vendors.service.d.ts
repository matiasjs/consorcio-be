import { Repository } from 'typeorm';
import { VendorAvailability } from '../../entities/vendor-availability.entity';
import { Vendor } from '../../entities/vendor.entity';
import { CreateVendorAvailabilityDto, CreateVendorDto, UpdateVendorAvailabilityDto, UpdateVendorDto } from './dto';
export declare class VendorsService {
    private readonly vendorRepository;
    private readonly availabilityRepository;
    constructor(vendorRepository: Repository<Vendor>, availabilityRepository: Repository<VendorAvailability>);
    create(createVendorDto: CreateVendorDto, adminId: string): Promise<Vendor>;
    findAll(adminId: string, trade?: string): Promise<Vendor[]>;
    findOne(id: string, adminId: string): Promise<Vendor>;
    update(id: string, updateVendorDto: UpdateVendorDto, adminId: string): Promise<Vendor>;
    remove(id: string, adminId: string): Promise<void>;
    createAvailability(vendorId: string, createAvailabilityDto: CreateVendorAvailabilityDto, adminId: string): Promise<VendorAvailability>;
    getAvailabilities(vendorId: string, adminId: string): Promise<VendorAvailability[]>;
    updateAvailability(vendorId: string, availabilityId: string, updateAvailabilityDto: UpdateVendorAvailabilityDto, adminId: string): Promise<VendorAvailability>;
    removeAvailability(vendorId: string, availabilityId: string, adminId: string): Promise<void>;
}
