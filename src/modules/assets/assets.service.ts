import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';
import { Asset } from '../../entities/asset.entity';
import { MaintenancePlan } from '../../entities/maintenance-plan.entity';
import { CreateAssetDto, CreateMaintenancePlanDto, UpdateAssetDto } from './dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(MaintenancePlan)
    private readonly maintenancePlanRepository: Repository<MaintenancePlan>,
  ) { }

  async create(createAssetDto: CreateAssetDto, user: RequestUser): Promise<Asset> {
    const assetData: any = {
      ...createAssetDto,
      adminId: user.adminId,
    };

    if (createAssetDto.purchaseDate) {
      assetData.purchaseDate = new Date(createAssetDto.purchaseDate);
    }
    if (createAssetDto.warrantyExpiryDate) {
      assetData.warrantyExpiryDate = new Date(createAssetDto.warrantyExpiryDate);
    }

    const asset = this.assetRepository.create(assetData);
    return await this.assetRepository.save(asset) as any;
  }

  async findAll(user: RequestUser, paginationDto: PaginationDto): Promise<{
    data: Asset[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.assetRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.building', 'building')
      .where('asset.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(asset.name ILIKE :search OR asset.category ILIKE :search OR asset.location ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy(`asset.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string, user: RequestUser): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: ['building', 'maintenancePlans'],
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return asset;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto, user: RequestUser): Promise<Asset> {
    const asset = await this.findOne(id, user);

    const updateData: any = { ...updateAssetDto };
    if (updateAssetDto.purchaseDate) {
      updateData.purchaseDate = new Date(updateAssetDto.purchaseDate);
    }
    if (updateAssetDto.warrantyExpiryDate) {
      updateData.warrantyExpiryDate = new Date(updateAssetDto.warrantyExpiryDate);
    }

    Object.assign(asset, updateData);
    return await this.assetRepository.save(asset) as any;
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const asset = await this.findOne(id, user);
    await this.assetRepository.softDelete(id);
  }

  // Maintenance Plans
  async getMaintenancePlans(assetId: string, user: RequestUser): Promise<MaintenancePlan[]> {
    const asset = await this.findOne(assetId, user);
    return await this.maintenancePlanRepository.find({
      where: { assetId },
      order: { createdAt: 'DESC' },
    });
  }

  async createMaintenancePlan(assetId: string, createPlanDto: CreateMaintenancePlanDto, user: RequestUser): Promise<MaintenancePlan> {
    const asset = await this.findOne(assetId, user);

    const plan = this.maintenancePlanRepository.create({
      ...createPlanDto,
      assetId,
    } as any);

    return await this.maintenancePlanRepository.save(plan) as any;
  }
}
