import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorInvoice } from '../../entities/vendor-invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(VendorInvoice)
    private readonly invoiceRepository: Repository<VendorInvoice>,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
    user: RequestUser,
  ): Promise<VendorInvoice> {
    const invoiceData: any = {
      ...createInvoiceDto,
      adminId: user.adminId,
      issueDate: new Date(createInvoiceDto.issueDate),
      dueDate: new Date(createInvoiceDto.dueDate),
    };

    const invoice = this.invoiceRepository.create(invoiceData);
    return (await this.invoiceRepository.save(invoice)) as any;
  }

  async findAll(
    user: RequestUser,
    paginationDto: PaginationDto,
  ): Promise<{
    data: VendorInvoice[];
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

    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.vendor', 'vendor')
      .leftJoinAndSelect('invoice.workOrder', 'workOrder')
      .where('invoice.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(invoice.invoiceNumber ILIKE :search OR invoice.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy(`invoice.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, user: RequestUser): Promise<VendorInvoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: ['vendor', 'workOrder'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    user: RequestUser,
  ): Promise<VendorInvoice> {
    const invoice = await this.findOne(id, user);

    const updateData: any = { ...updateInvoiceDto };
    if (updateInvoiceDto.issueDate) {
      updateData.issueDate = new Date(updateInvoiceDto.issueDate);
    }
    if (updateInvoiceDto.dueDate) {
      updateData.dueDate = new Date(updateInvoiceDto.dueDate);
    }

    Object.assign(invoice, updateData);
    return (await this.invoiceRepository.save(invoice)) as any;
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const invoice = await this.findOne(id, user);
    await this.invoiceRepository.softDelete(id);
  }

  async findByStatus(
    status: string,
    user: RequestUser,
  ): Promise<VendorInvoice[]> {
    return await this.invoiceRepository.find({
      where: {
        adminId: user.adminId,
        status: status as any,
      },
      relations: ['vendor', 'workOrder'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOverdueInvoices(user: RequestUser): Promise<VendorInvoice[]> {
    const today = new Date();
    return await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.vendor', 'vendor')
      .leftJoinAndSelect('invoice.workOrder', 'workOrder')
      .where('invoice.adminId = :adminId', { adminId: user.adminId })
      .andWhere('invoice.dueDate < :today', { today })
      .andWhere('invoice.status != :paidStatus', { paidStatus: 'PAID' })
      .andWhere('invoice.status != :cancelledStatus', {
        cancelledStatus: 'CANCELLED',
      })
      .orderBy('invoice.dueDate', 'ASC')
      .getMany();
  }

  async getTotalsByStatus(user: RequestUser): Promise<any> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('invoice.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(invoice.amount)', 'total')
      .where('invoice.adminId = :adminId', { adminId: user.adminId })
      .groupBy('invoice.status')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.status] = {
        count: parseInt(item.count),
        total: parseFloat(item.total) || 0,
      };
      return acc;
    }, {});
  }
}
