import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';
import { Document } from '../../entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    user: RequestUser,
  ): Promise<Document> {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      adminId: user.adminId,
      uploadedByUserId: user.id,
    } as any);

    return (await this.documentRepository.save(document)) as any;
  }

  async findAll(
    user: RequestUser,
    paginationDto: PaginationDto,
  ): Promise<{
    data: Document[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.building', 'building')
      .leftJoinAndSelect('document.uploadedBy', 'uploadedBy')
      .where('document.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(document.title ILIKE :search OR document.description ILIKE :search OR document.category ILIKE :search OR document.tags ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`document.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string, user: RequestUser): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: ['building', 'uploadedBy'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    user: RequestUser,
  ): Promise<Document> {
    const document = await this.findOne(id, user);

    Object.assign(document, updateDocumentDto);
    return (await this.documentRepository.save(document)) as any;
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const document = await this.findOne(id, user);
    await this.documentRepository.softDelete(id);
  }

  async findByType(type: string, user: RequestUser): Promise<Document[]> {
    return await this.documentRepository.find({
      where: {
        adminId: user.adminId,
        type: type as any,
      },
      relations: ['building', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(
    category: string,
    user: RequestUser,
  ): Promise<Document[]> {
    return await this.documentRepository.find({
      where: {
        adminId: user.adminId,
        category,
      },
      relations: ['building', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByBuilding(
    buildingId: string,
    user: RequestUser,
  ): Promise<Document[]> {
    return await this.documentRepository.find({
      where: {
        adminId: user.adminId,
        buildingId,
      },
      relations: ['building', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async searchByTags(tags: string[], user: RequestUser): Promise<Document[]> {
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.building', 'building')
      .leftJoinAndSelect('document.uploadedBy', 'uploadedBy')
      .where('document.adminId = :adminId', { adminId: user.adminId });

    tags.forEach((tag, index) => {
      queryBuilder.andWhere(`document.tags ILIKE :tag${index}`, {
        [`tag${index}`]: `%${tag}%`,
      });
    });

    return await queryBuilder.orderBy('document.createdAt', 'DESC').getMany();
  }
}
