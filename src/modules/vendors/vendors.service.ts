import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorAvailability } from '../../entities/vendor-availability.entity';
import { Vendor } from '../../entities/vendor.entity';
import {
  CreateVendorAvailabilityDto,
  CreateVendorDto,
  UpdateVendorAvailabilityDto,
  UpdateVendorDto,
} from './dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(VendorAvailability)
    private readonly availabilityRepository: Repository<VendorAvailability>,
  ) {}

  async create(
    createVendorDto: CreateVendorDto,
    adminId: string,
  ): Promise<Vendor> {
    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      adminId,
    });

    return this.vendorRepository.save(vendor);
  }

  async findAll(adminId: string, trade?: string): Promise<Vendor[]> {
    const where: any = { adminId };
    if (trade) {
      where.trade = trade;
    }

    return this.vendorRepository.find({
      where,
      relations: ['administration', 'availabilities'],
    });
  }

  async findOne(id: string, adminId: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id, adminId },
      relations: ['administration', 'availabilities'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(
    id: string,
    updateVendorDto: UpdateVendorDto,
    adminId: string,
  ): Promise<Vendor> {
    const vendor = await this.findOne(id, adminId);
    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async remove(id: string, adminId: string): Promise<void> {
    const vendor = await this.findOne(id, adminId);
    await this.vendorRepository.softDelete(id);
  }

  async createAvailability(
    vendorId: string,
    createAvailabilityDto: CreateVendorAvailabilityDto,
    adminId: string,
  ): Promise<VendorAvailability> {
    const vendor = await this.findOne(vendorId, adminId);

    const availability = this.availabilityRepository.create({
      vendorId,
      weekday: createAvailabilityDto.weekday as any,
      from: createAvailabilityDto.from,
      to: createAvailabilityDto.to,
    });

    return this.availabilityRepository.save(availability);
  }

  async getAvailabilities(
    vendorId: string,
    adminId: string,
  ): Promise<VendorAvailability[]> {
    const vendor = await this.findOne(vendorId, adminId);

    return this.availabilityRepository.find({
      where: { vendorId },
      relations: ['vendor'],
    });
  }

  async updateAvailability(
    vendorId: string,
    availabilityId: string,
    updateAvailabilityDto: UpdateVendorAvailabilityDto,
    adminId: string,
  ): Promise<VendorAvailability> {
    const vendor = await this.findOne(vendorId, adminId);

    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId, vendorId },
    });

    if (!availability) {
      throw new NotFoundException(
        `Availability with ID ${availabilityId} not found`,
      );
    }

    Object.assign(availability, updateAvailabilityDto);
    return this.availabilityRepository.save(availability);
  }

  async removeAvailability(
    vendorId: string,
    availabilityId: string,
    adminId: string,
  ): Promise<void> {
    const vendor = await this.findOne(vendorId, adminId);

    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId, vendorId },
    });

    if (!availability) {
      throw new NotFoundException(
        `Availability with ID ${availabilityId} not found`,
      );
    }

    await this.availabilityRepository.remove(availability);
  }
}
