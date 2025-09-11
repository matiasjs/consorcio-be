import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role, Permission } from '../../../entities';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from '../dto';
import { PaginationDto } from '../../../common/dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto, adminId: string): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name, adminId },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role with name "${createRoleDto.name}" already exists`,
      );
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      adminId,
    });

    return (await this.roleRepository.save(role)) as any;
  }

  async findAll(
    adminId: string,
    pagination: PaginationDto,
  ): Promise<{ data: Role[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.adminId = :adminId', { adminId });

    if (search) {
      queryBuilder.andWhere(
        '(role.name ILIKE :search OR role.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy(`role.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: string, adminId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, adminId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    adminId: string,
  ): Promise<Role> {
    const role = await this.findOne(id, adminId);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name, adminId },
      });

      if (existingRole) {
        throw new ConflictException(
          `Role with name "${updateRoleDto.name}" already exists`,
        );
      }
    }

    Object.assign(role, updateRoleDto);
    return (await this.roleRepository.save(role)) as any;
  }

  async remove(id: string, adminId: string): Promise<void> {
    const role = await this.findOne(id, adminId);
    await this.roleRepository.softDelete(id);
  }

  async assignPermissions(
    id: string,
    assignPermissionsDto: AssignPermissionsDto,
    adminId: string,
  ): Promise<Role> {
    const role = await this.findOne(id, adminId);
    const { add = [], remove = [] } = assignPermissionsDto;

    if (add.length > 0) {
      const permissionsToAdd = await this.permissionRepository.find({
        where: { code: In(add) },
      });

      if (permissionsToAdd.length !== add.length) {
        const foundCodes = permissionsToAdd.map((p) => p.code);
        const notFound = add.filter((code) => !foundCodes.includes(code));
        throw new NotFoundException(
          `Permissions not found: ${notFound.join(', ')}`,
        );
      }

      role.permissions = [...(role.permissions || []), ...permissionsToAdd];
    }

    if (remove.length > 0) {
      role.permissions = (role.permissions || []).filter(
        (permission) => !remove.includes(permission.code),
      );
    }

    return (await this.roleRepository.save(role)) as any;
  }
}
