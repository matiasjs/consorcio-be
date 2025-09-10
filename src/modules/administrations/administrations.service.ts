import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administration } from '../../entities/administration.entity';
import { CreateAdministrationDto, UpdateAdministrationDto } from './dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class AdministrationsService {
  constructor(
    @InjectRepository(Administration)
    private administrationRepository: Repository<Administration>,
  ) {}

  async create(createAdministrationDto: CreateAdministrationDto): Promise<Administration> {
    // Check if CUIT already exists
    const existingByCuit = await this.administrationRepository.findOne({
      where: { cuit: createAdministrationDto.cuit },
    });

    if (existingByCuit) {
      throw new ConflictException('Administration with this CUIT already exists');
    }

    // Check if email already exists
    const existingByEmail = await this.administrationRepository.findOne({
      where: { email: createAdministrationDto.email },
    });

    if (existingByEmail) {
      throw new ConflictException('Administration with this email already exists');
    }

    const administration = this.administrationRepository.create(createAdministrationDto);
    return this.administrationRepository.save(administration);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<Administration>> {
    const { page = 1, limit = 20, sort } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.administrationRepository.createQueryBuilder('administration');

    // Apply sorting
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach((field, index) => {
        const isDescending = field.startsWith('-');
        const fieldName = isDescending ? field.substring(1) : field;
        const direction = isDescending ? 'DESC' : 'ASC';
        
        if (index === 0) {
          queryBuilder.orderBy(`administration.${fieldName}`, direction);
        } else {
          queryBuilder.addOrderBy(`administration.${fieldName}`, direction);
        }
      });
    } else {
      queryBuilder.orderBy('administration.createdAt', 'DESC');
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Administration> {
    const administration = await this.administrationRepository.findOne({
      where: { id },
      relations: ['users', 'buildings'],
    });

    if (!administration) {
      throw new NotFoundException('Administration not found');
    }

    return administration;
  }

  async update(id: string, updateAdministrationDto: UpdateAdministrationDto): Promise<Administration> {
    const administration = await this.findOne(id);

    // Check if email already exists (if being updated)
    if (updateAdministrationDto.email && updateAdministrationDto.email !== administration.email) {
      const existingByEmail = await this.administrationRepository.findOne({
        where: { email: updateAdministrationDto.email },
      });

      if (existingByEmail) {
        throw new ConflictException('Administration with this email already exists');
      }
    }

    Object.assign(administration, updateAdministrationDto);
    return this.administrationRepository.save(administration);
  }

  async remove(id: string): Promise<void> {
    const administration = await this.findOne(id);
    await this.administrationRepository.softDelete(id);
  }
}
