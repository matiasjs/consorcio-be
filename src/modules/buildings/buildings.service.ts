import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from '../../entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto } from './dto';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto, adminId: string): Promise<Building> {
    const building = this.buildingRepository.create({
      ...createBuildingDto,
      adminId,
    });

    return this.buildingRepository.save(building);
  }

  async findAll(adminId: string): Promise<Building[]> {
    return this.buildingRepository.find({
      where: { adminId },
      relations: ['administration', 'units'],
    });
  }

  async findOne(id: string, adminId: string): Promise<Building> {
    const building = await this.buildingRepository.findOne({
      where: { id, adminId },
      relations: ['administration', 'units'],
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }

    return building;
  }

  async update(id: string, updateBuildingDto: UpdateBuildingDto, adminId: string): Promise<Building> {
    const building = await this.findOne(id, adminId);
    Object.assign(building, updateBuildingDto);
    return this.buildingRepository.save(building);
  }

  async remove(id: string, adminId: string): Promise<void> {
    const building = await this.findOne(id, adminId);
    await this.buildingRepository.softDelete(id);
  }
}
