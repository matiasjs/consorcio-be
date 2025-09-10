import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialItem } from '../../entities/material-item.entity';
import { CreateMaterialDto, UpdateMaterialDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(MaterialItem)
    private readonly materialRepository: Repository<MaterialItem>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto, user: RequestUser): Promise<MaterialItem> {
    const material = this.materialRepository.create({
      ...createMaterialDto,
      adminId: user.adminId,
    });

    return await this.materialRepository.save(material);
  }

  async findAll(user: RequestUser, paginationDto: PaginationDto): Promise<{
    data: MaterialItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.materialRepository
      .createQueryBuilder('material')
      .where('material.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(material.name ILIKE :search OR material.description ILIKE :search OR material.category ILIKE :search OR material.sku ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy(`material.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, user: RequestUser): Promise<MaterialItem> {
    const material = await this.materialRepository.findOne({
      where: { id, adminId: user.adminId },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    return material;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto, user: RequestUser): Promise<MaterialItem> {
    const material = await this.findOne(id, user);

    Object.assign(material, updateMaterialDto);
    return await this.materialRepository.save(material);
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const material = await this.findOne(id, user);
    await this.materialRepository.softDelete(id);
  }

  async findByCategory(category: string, user: RequestUser): Promise<MaterialItem[]> {
    return await this.materialRepository.find({
      where: { 
        adminId: user.adminId,
        category,
      },
      order: { name: 'ASC' },
    });
  }

  async getLowStockItems(user: RequestUser): Promise<MaterialItem[]> {
    return await this.materialRepository
      .createQueryBuilder('material')
      .where('material.adminId = :adminId', { adminId: user.adminId })
      .andWhere('material.stockQuantity <= material.minStockLevel')
      .andWhere('material.minStockLevel IS NOT NULL')
      .orderBy('material.stockQuantity', 'ASC')
      .getMany();
  }
}
