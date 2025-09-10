import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOccupancy } from '../../entities/unit-occupancy.entity';
import { Unit } from '../../entities/unit.entity';
import { CreateUnitDto, CreateUnitOccupancyDto, UpdateUnitDto } from './dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(UnitOccupancy)
    private readonly occupancyRepository: Repository<UnitOccupancy>,
  ) { }

  async create(createUnitDto: CreateUnitDto, adminId: string): Promise<Unit> {
    const unit = this.unitRepository.create({
      buildingId: createUnitDto.buildingId,
      label: createUnitDto.label,
      type: createUnitDto.type as any,
      floor: createUnitDto.floor,
      m2: createUnitDto.m2,
      isRented: createUnitDto.isRented || false,
    });

    return this.unitRepository.save(unit);
  }

  async findAll(adminId: string): Promise<Unit[]> {
    return this.unitRepository.find({
      where: { building: { adminId } },
      relations: ['building', 'occupancies'],
    });
  }

  async findOne(id: string, adminId: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({
      where: { id, building: { adminId } },
      relations: ['building', 'occupancies'],
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto, adminId: string): Promise<Unit> {
    const unit = await this.findOne(id, adminId);
    Object.assign(unit, updateUnitDto);
    return this.unitRepository.save(unit);
  }

  async remove(id: string, adminId: string): Promise<void> {
    const unit = await this.findOne(id, adminId);
    await this.unitRepository.softDelete(id);
  }

  async createOccupancy(
    unitId: string,
    createOccupancyDto: CreateUnitOccupancyDto,
    adminId: string,
  ): Promise<UnitOccupancy> {
    const unit = await this.findOne(unitId, adminId);

    const occupancy = this.occupancyRepository.create({
      unitId,
      ownerUserId: createOccupancyDto.ownerUserId,
      tenantUserId: createOccupancyDto.tenantUserId,
      startDate: new Date(createOccupancyDto.startDate),
      endDate: createOccupancyDto.endDate ? new Date(createOccupancyDto.endDate) : undefined,
    });

    return this.occupancyRepository.save(occupancy);
  }

  async getOccupancy(unitId: string, adminId: string): Promise<UnitOccupancy[]> {
    const unit = await this.findOne(unitId, adminId);

    return this.occupancyRepository.find({
      where: { unitId },
      relations: ['unit', 'ownerUser', 'tenantUser'],
    });
  }
}
