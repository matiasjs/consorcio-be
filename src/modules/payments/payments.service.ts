import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: RequestUser): Promise<Payment> {
    const paymentData: any = {
      ...createPaymentDto,
      adminId: user.adminId,
      paymentDate: new Date(createPaymentDto.paymentDate),
    };

    const payment = this.paymentRepository.create(paymentData);
    return await this.paymentRepository.save(payment) as any;
  }

  async findAll(user: RequestUser, paginationDto: PaginationDto): Promise<{
    data: Payment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.invoice', 'invoice')
      .leftJoinAndSelect('payment.vendor', 'vendor')
      .where('payment.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(payment.referenceNumber ILIKE :search OR payment.description ILIKE :search OR payment.transactionId ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy(`payment.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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

  async findOne(id: string, user: RequestUser): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: ['invoice', 'vendor'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, user: RequestUser): Promise<Payment> {
    const payment = await this.findOne(id, user);

    const updateData: any = { ...updatePaymentDto };
    if (updatePaymentDto.paymentDate) {
      updateData.paymentDate = new Date(updatePaymentDto.paymentDate);
    }

    Object.assign(payment, updateData);
    return await this.paymentRepository.save(payment) as any;
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const payment = await this.findOne(id, user);
    await this.paymentRepository.softDelete(id);
  }

  async findByStatus(status: string, user: RequestUser): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { 
        adminId: user.adminId,
        status: status as any,
      },
      relations: ['invoice', 'vendor'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findByMethod(method: string, user: RequestUser): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { 
        adminId: user.adminId,
        method: method as any,
      },
      relations: ['invoice', 'vendor'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date, user: RequestUser): Promise<Payment[]> {
    return await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.invoice', 'invoice')
      .leftJoinAndSelect('payment.vendor', 'vendor')
      .where('payment.adminId = :adminId', { adminId: user.adminId })
      .andWhere('payment.paymentDate >= :startDate', { startDate })
      .andWhere('payment.paymentDate <= :endDate', { endDate })
      .orderBy('payment.paymentDate', 'DESC')
      .getMany();
  }

  async getTotalsByStatus(user: RequestUser): Promise<any> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.adminId = :adminId', { adminId: user.adminId })
      .groupBy('payment.status')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.status] = {
        count: parseInt(item.count),
        total: parseFloat(item.total) || 0,
      };
      return acc;
    }, {});
  }

  async getTotalsByMethod(user: RequestUser): Promise<any> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.method', 'method')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.adminId = :adminId', { adminId: user.adminId })
      .groupBy('payment.method')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.method] = {
        count: parseInt(item.count),
        total: parseFloat(item.total) || 0,
      };
      return acc;
    }, {});
  }
}
