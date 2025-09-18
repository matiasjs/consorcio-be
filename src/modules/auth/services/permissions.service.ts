import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../../entities';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto';
import { PaginationDto } from '../../../common/dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission = await this.permissionRepository.findOne({
      where: { code: createPermissionDto.code },
    });

    if (existingPermission) {
      throw new ConflictException(
        `Permission with code "${createPermissionDto.code}" already exists`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return (await this.permissionRepository.save(permission)) as any;
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: Permission[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'code',
      sortOrder = 'ASC',
    } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');

    if (search) {
      queryBuilder.where(
        '(permission.code ILIKE :search OR permission.description ILIKE :search OR permission.module ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`permission.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    if (
      updatePermissionDto.code &&
      updatePermissionDto.code !== permission.code
    ) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { code: updatePermissionDto.code },
      });

      if (existingPermission) {
        throw new ConflictException(
          `Permission with code "${updatePermissionDto.code}" already exists`,
        );
      }
    }

    Object.assign(permission, updatePermissionDto);
    return (await this.permissionRepository.save(permission)) as any;
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.softDelete(id);
  }
}
