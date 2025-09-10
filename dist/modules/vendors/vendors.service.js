"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_availability_entity_1 = require("../../entities/vendor-availability.entity");
const vendor_entity_1 = require("../../entities/vendor.entity");
let VendorsService = class VendorsService {
    vendorRepository;
    availabilityRepository;
    constructor(vendorRepository, availabilityRepository) {
        this.vendorRepository = vendorRepository;
        this.availabilityRepository = availabilityRepository;
    }
    async create(createVendorDto, adminId) {
        const vendor = this.vendorRepository.create({
            ...createVendorDto,
            adminId,
        });
        return this.vendorRepository.save(vendor);
    }
    async findAll(adminId, trade) {
        const where = { adminId };
        if (trade) {
            where.trade = trade;
        }
        return this.vendorRepository.find({
            where,
            relations: ['administration', 'availabilities'],
        });
    }
    async findOne(id, adminId) {
        const vendor = await this.vendorRepository.findOne({
            where: { id, adminId },
            relations: ['administration', 'availabilities'],
        });
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor with ID ${id} not found`);
        }
        return vendor;
    }
    async update(id, updateVendorDto, adminId) {
        const vendor = await this.findOne(id, adminId);
        Object.assign(vendor, updateVendorDto);
        return this.vendorRepository.save(vendor);
    }
    async remove(id, adminId) {
        const vendor = await this.findOne(id, adminId);
        await this.vendorRepository.softDelete(id);
    }
    async createAvailability(vendorId, createAvailabilityDto, adminId) {
        const vendor = await this.findOne(vendorId, adminId);
        const availability = this.availabilityRepository.create({
            vendorId,
            weekday: createAvailabilityDto.weekday,
            from: createAvailabilityDto.from,
            to: createAvailabilityDto.to,
        });
        return this.availabilityRepository.save(availability);
    }
    async getAvailabilities(vendorId, adminId) {
        const vendor = await this.findOne(vendorId, adminId);
        return this.availabilityRepository.find({
            where: { vendorId },
            relations: ['vendor'],
        });
    }
    async updateAvailability(vendorId, availabilityId, updateAvailabilityDto, adminId) {
        const vendor = await this.findOne(vendorId, adminId);
        const availability = await this.availabilityRepository.findOne({
            where: { id: availabilityId, vendorId },
        });
        if (!availability) {
            throw new common_1.NotFoundException(`Availability with ID ${availabilityId} not found`);
        }
        Object.assign(availability, updateAvailabilityDto);
        return this.availabilityRepository.save(availability);
    }
    async removeAvailability(vendorId, availabilityId, adminId) {
        const vendor = await this.findOne(vendorId, adminId);
        const availability = await this.availabilityRepository.findOne({
            where: { id: availabilityId, vendorId },
        });
        if (!availability) {
            throw new common_1.NotFoundException(`Availability with ID ${availabilityId} not found`);
        }
        await this.availabilityRepository.remove(availability);
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(1, (0, typeorm_1.InjectRepository)(vendor_availability_entity_1.VendorAvailability)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map