import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Expense,
  ExpenseItem,
  ExpenseDistribution,
  ExpenseStatus,
  ExpenseDistributionMethod,
  ExpenseItemType,
  ExpenseItemCategory,
  Unit,
  VendorInvoice,
  Building,
} from '../../entities';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  GenerateExpenseDto,
  UpdateExpenseDistributionDto,
} from './dto';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';
import {
  ExpenseAlreadyExistsException,
  BuildingNotFoundOrUnauthorizedException,
  NoActiveUnitsException,
  InvalidPeriodFormatException,
  FuturePeriodException,
  InvalidDueDateException,
  EmptyExpenseItemsException,
  InvalidExpenseAmountException,
  ExpenseItemDescriptionRequiredException,
  InvalidDistributionMethodException,
  ExpenseAlreadyGeneratedException,
  InsufficientOwnershipDataException,
  InsufficientM2DataException,
} from './exceptions/expense-business.exceptions';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseItem)
    private readonly expenseItemRepository: Repository<ExpenseItem>,
    @InjectRepository(ExpenseDistribution)
    private readonly expenseDistributionRepository: Repository<ExpenseDistribution>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(VendorInvoice)
    private readonly vendorInvoiceRepository: Repository<VendorInvoice>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    user: RequestUser,
  ): Promise<Expense> {
    // Validate business rules
    await this.validateCreateExpenseDto(createExpenseDto, user);

    // Check if expense already exists for this building and period
    let existingExpense = await this.expenseRepository.findOne({
      where: {
        buildingId: createExpenseDto.buildingId,
        period: createExpenseDto.period,
        adminId: user.adminId,
      },
      relations: ['items', 'distributions', 'building'],
    });

    // If expense exists, add items to existing expense
    if (existingExpense) {
      return this.addItemsToExistingExpense(
        existingExpense,
        createExpenseDto,
        user,
      );
    }

    // Get building (already validated in validateCreateExpenseDto)
    const building = await this.buildingRepository.findOne({
      where: { id: createExpenseDto.buildingId, adminId: user.adminId },
    });

    // Calculate total amount
    const totalAmount = createExpenseDto.items.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    // Generate automatic title based on period
    const periodTitle = this.formatPeriodTitle(createExpenseDto.period);

    // Create expense
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      title: periodTitle,
      description:
        createExpenseDto.description ||
        `Expensas correspondientes al período ${periodTitle}`,
      adminId: user.adminId,
      totalAmount,
      dueDate: new Date(createExpenseDto.dueDate),
      currency: createExpenseDto.currency || 'ARS',
      distributionMethod:
        createExpenseDto.distributionMethod || ExpenseDistributionMethod.EQUAL,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    // Create expense items
    const items = createExpenseDto.items.map((itemDto) =>
      this.expenseItemRepository.create({
        ...itemDto,
        expenseId: savedExpense.id,
        currency: itemDto.currency || 'ARS',
        quantity: itemDto.quantity || 1,
        serviceDate: itemDto.serviceDate
          ? new Date(itemDto.serviceDate)
          : undefined,
      }),
    );

    await this.expenseItemRepository.save(items);

    // Generate distributions
    await this.generateDistributions(savedExpense.id, user);

    return this.findOne(savedExpense.id, user);
  }

  async generateExpense(
    generateExpenseDto: GenerateExpenseDto,
    user: RequestUser,
  ): Promise<Expense> {
    const {
      buildingId,
      period,
      distributionMethod = ExpenseDistributionMethod.EQUAL,
      dueDate,
      includeRecurring = true,
      includeCommon = true,
      includeExtraordinary = true,
      forceRegenerate = false,
      customTitle,
      description,
    } = generateExpenseDto;

    // Validate business rules
    await this.validateGenerateExpenseDto(generateExpenseDto, user);

    // Check if expense already exists
    const existingExpense = await this.expenseRepository.findOne({
      where: { buildingId, period, adminId: user.adminId },
      relations: ['building'],
    });

    if (existingExpense && !forceRegenerate) {
      throw new ExpenseAlreadyExistsException(
        period,
        existingExpense.building?.name,
      );
    }

    // Delete existing expense if force regenerate
    if (existingExpense && forceRegenerate) {
      await this.remove(existingExpense.id, user);
    }

    // Verify building exists
    const building = await this.buildingRepository.findOne({
      where: { id: buildingId, adminId: user.adminId },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    // Generate expense items based on configuration
    const items: any[] = [];

    // Add recurring expenses (mock data - in real app, get from configuration)
    if (includeRecurring) {
      items.push({
        description: 'Sueldo portero',
        type: ExpenseItemType.RECURRING,
        category: ExpenseItemCategory.STAFF_SALARIES,
        amount: 85000,
      });
      items.push({
        description: 'Seguro del edificio',
        type: ExpenseItemType.RECURRING,
        category: ExpenseItemCategory.INSURANCE,
        amount: 15000,
      });
    }

    // Add common expenses (mock data)
    if (includeCommon) {
      items.push({
        description: 'Luz común',
        type: ExpenseItemType.COMMON,
        category: ExpenseItemCategory.UTILITIES,
        amount: 12000,
      });
      items.push({
        description: 'Limpieza',
        type: ExpenseItemType.COMMON,
        category: ExpenseItemCategory.CLEANING,
        amount: 8000,
      });
    }

    // Add extraordinary expenses from work orders
    if (includeExtraordinary) {
      const [year, month] = period.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const workOrderInvoices = await this.vendorInvoiceRepository
        .createQueryBuilder('invoice')
        .leftJoin('invoice.workOrder', 'workOrder')
        .leftJoin('workOrder.ticket', 'ticket')
        .where('invoice.adminId = :adminId', { adminId: user.adminId })
        .andWhere('ticket.buildingId = :buildingId', { buildingId })
        .andWhere('invoice.issueDate >= :startDate', { startDate })
        .andWhere('invoice.issueDate <= :endDate', { endDate })
        .andWhere('invoice.status = :status', { status: 'APPROVED' })
        .getMany();

      for (const invoice of workOrderInvoices) {
        items.push({
          description: `Reparación - ${invoice.description || 'Orden de trabajo'}`,
          type: ExpenseItemType.EXTRAORDINARY,
          category: ExpenseItemCategory.REPAIRS,
          amount: invoice.total,
          relatedVendorInvoiceId: invoice.id,
          relatedWorkOrderId: invoice.workOrderId,
        });
      }
    }

    // Create expense
    const title = this.formatPeriodTitle(period);
    const createExpenseDto: CreateExpenseDto = {
      buildingId,
      period,
      title,
      description:
        description ||
        `Expensas correspondientes al período ${this.formatPeriodTitle(period)}`,
      distributionMethod,
      dueDate,
      items,
    };

    return this.create(createExpenseDto, user);
  }

  async findAll(
    user: RequestUser,
    paginationDto: PaginationDto,
  ): Promise<{
    data: Expense[];
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

    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.building', 'building')
      .leftJoinAndSelect('expense.items', 'items')
      .where('expense.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(expense.title ILIKE :search OR expense.description ILIKE :search OR building.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`expense.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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

  async findOne(id: string, user: RequestUser): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: ['building', 'items', 'distributions', 'distributions.unit'],
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    user: RequestUser,
  ): Promise<Expense> {
    const expense = await this.findOne(id, user);

    const updateData: any = { ...updateExpenseDto };
    if (updateExpenseDto.dueDate) {
      updateData.dueDate = new Date(updateExpenseDto.dueDate);
    }
    if (updateExpenseDto.generatedAt) {
      updateData.generatedAt = new Date(updateExpenseDto.generatedAt);
    }
    if (updateExpenseDto.sentAt) {
      updateData.sentAt = new Date(updateExpenseDto.sentAt);
    }

    Object.assign(expense, updateData);
    await this.expenseRepository.save(expense);

    return this.findOne(id, user);
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const expense = await this.findOne(id, user);
    await this.expenseRepository.remove(expense);
  }

  private async generateDistributions(
    expenseId: string,
    user: RequestUser,
  ): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['building'],
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Get active units for the building
    const units = await this.unitRepository.find({
      where: { buildingId: expense.buildingId, isActive: true },
      relations: [
        'occupancies',
        'occupancies.ownerUser',
        'occupancies.tenantUser',
      ],
    });

    if (units.length === 0) {
      throw new NoActiveUnitsException(expense.building?.name);
    }

    // Validate distribution method compatibility
    this.validateDistributionMethodCompatibility(
      expense.distributionMethod,
      units,
      expense.building?.name,
    );

    const distributions: any[] = [];

    for (const unit of units) {
      let amount = 0;
      let distributionPercentage = 0;

      // Calculate amount based on distribution method
      switch (expense.distributionMethod) {
        case ExpenseDistributionMethod.EQUAL:
          amount = expense.totalAmount / units.length;
          distributionPercentage = 1 / units.length;
          break;

        case ExpenseDistributionMethod.BY_OWNERSHIP:
          if (unit.ownershipPercentage) {
            amount = expense.totalAmount * (unit.ownershipPercentage / 100);
            distributionPercentage = unit.ownershipPercentage / 100;
          } else {
            // Fallback to equal distribution
            amount = expense.totalAmount / units.length;
            distributionPercentage = 1 / units.length;
          }
          break;

        case ExpenseDistributionMethod.BY_M2:
          if (unit.m2) {
            const totalM2 = units.reduce((sum, u) => sum + (u.m2 || 0), 0);
            if (totalM2 > 0) {
              amount = expense.totalAmount * (unit.m2 / totalM2);
              distributionPercentage = unit.m2 / totalM2;
            }
          }
          if (amount === 0) {
            // Fallback to equal distribution
            amount = expense.totalAmount / units.length;
            distributionPercentage = 1 / units.length;
          }
          break;

        default:
          amount = expense.totalAmount / units.length;
          distributionPercentage = 1 / units.length;
      }

      // Get current occupancy info
      const currentOccupancy = unit.occupancies?.find(
        (occ) => !occ.endDate || new Date(occ.endDate) > new Date(),
      );

      const distribution = this.expenseDistributionRepository.create({
        expenseId: expense.id,
        unitId: unit.id,
        unitLabel: unit.label,
        amount: Math.round(amount * 100) / 100, // Round to 2 decimals
        currency: expense.currency,
        distributionPercentage,
        unitM2: unit.m2,
        ownershipPercentage: unit.ownershipPercentage,
        remainingAmount: Math.round(amount * 100) / 100,
        dueDate: expense.dueDate,
        ownerInfo: currentOccupancy?.ownerUser
          ? {
              ownerUserId: currentOccupancy.ownerUser.id,
              ownerName: currentOccupancy.ownerUser.fullName,
              ownerEmail: currentOccupancy.ownerUser.email,
              ownerPhone: currentOccupancy.ownerUser.phone,
            }
          : undefined,
        tenantInfo: currentOccupancy?.tenantUser
          ? {
              tenantUserId: currentOccupancy.tenantUser.id,
              tenantName: currentOccupancy.tenantUser.fullName,
              tenantEmail: currentOccupancy.tenantUser.email,
              tenantPhone: currentOccupancy.tenantUser.phone,
            }
          : undefined,
      });

      distributions.push(distribution);
    }

    await this.expenseDistributionRepository.save(distributions);
  }

  async updateDistribution(
    expenseId: string,
    unitId: string,
    updateDto: UpdateExpenseDistributionDto,
    user: RequestUser,
  ): Promise<ExpenseDistribution> {
    const distribution = await this.expenseDistributionRepository.findOne({
      where: { expenseId, unitId },
      relations: ['expense'],
    });

    if (!distribution || distribution.expense.adminId !== user.adminId) {
      throw new NotFoundException('Distribution not found');
    }

    const updateData: any = { ...updateDto };
    if (updateDto.paidAt) {
      updateData.paidAt = new Date(updateDto.paidAt);
    }

    // Update remaining amount if paid amount changed
    if (updateDto.paidAmount !== undefined) {
      updateData.remainingAmount = distribution.amount - updateDto.paidAmount;

      // Update status based on payment
      if (updateDto.paidAmount >= distribution.amount) {
        updateData.status = 'PAID';
      } else if (updateDto.paidAmount > 0) {
        updateData.status = 'PARTIAL';
      }
    }

    Object.assign(distribution, updateData);
    return await this.expenseDistributionRepository.save(distribution);
  }

  async getDistributions(
    expenseId: string,
    user: RequestUser,
  ): Promise<ExpenseDistribution[]> {
    const expense = await this.findOne(expenseId, user);
    return expense.distributions;
  }

  async getExpensesByBuilding(
    buildingId: string,
    user: RequestUser,
  ): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { buildingId, adminId: user.adminId },
      relations: ['items'],
      order: { period: 'DESC' },
    });
  }

  async getExpensesByPeriod(
    period: string,
    user: RequestUser,
  ): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { period, adminId: user.adminId },
      relations: ['building', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  private async addItemsToExistingExpense(
    existingExpense: Expense,
    createExpenseDto: CreateExpenseDto,
    user: RequestUser,
  ): Promise<Expense> {
    // Ensure the existing expense has a valid ID
    if (!existingExpense.id) {
      throw new Error('Existing expense does not have a valid ID');
    }

    // Create and save new expense items one by one to avoid relation issues
    const savedItems: ExpenseItem[] = [];

    for (const itemDto of createExpenseDto.items) {
      const item = this.expenseItemRepository.create({
        expenseId: existingExpense.id,
        description: itemDto.description,
        type: itemDto.type,
        category: itemDto.category,
        amount: itemDto.amount,
        quantity: itemDto.quantity || 1,
        unitPrice: itemDto.unitPrice || itemDto.amount,
        currency: itemDto.currency || 'ARS',
        serviceDate: itemDto.serviceDate
          ? new Date(itemDto.serviceDate)
          : undefined,
        notes: itemDto.notes,
        relatedWorkOrderId: itemDto.relatedWorkOrderId,
        relatedVendorInvoiceId: itemDto.relatedVendorInvoiceId,
      });

      const savedItem = await this.expenseItemRepository.save(item);
      savedItems.push(savedItem);
    }

    // Update total amount
    const additionalAmount = savedItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    existingExpense.totalAmount += additionalAmount;

    // Keep the existing title and description (don't update from new items)

    // Save updated expense
    await this.expenseRepository.save(existingExpense);

    // Regenerate distributions with new total
    await this.regenerateDistributions(existingExpense, user);

    // Return updated expense with all relations
    const updatedExpense = await this.expenseRepository.findOne({
      where: { id: existingExpense.id },
      relations: ['building', 'items', 'distributions'],
    });

    if (!updatedExpense) {
      throw new Error('Failed to retrieve updated expense');
    }

    return updatedExpense;
  }

  private async regenerateDistributions(
    expense: Expense,
    user: RequestUser,
  ): Promise<void> {
    // Delete existing distributions
    await this.expenseDistributionRepository.delete({ expenseId: expense.id });

    // Generate new distributions
    await this.generateDistributions(expense.id, user);
  }

  private formatPeriodTitle(period: string): string {
    const [year, month] = period.split('-');
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const monthName = monthNames[parseInt(month) - 1];
    return `Expensas ${monthName} ${year}`;
  }

  // Business Rule Validation Methods
  private async validateCreateExpenseDto(
    createExpenseDto: CreateExpenseDto,
    user: RequestUser,
  ): Promise<void> {
    // Validate period format
    this.validatePeriodFormat(createExpenseDto.period);

    // Validate future period
    this.validateNotFuturePeriod(createExpenseDto.period);

    // Validate due date
    this.validateDueDate(createExpenseDto.dueDate, createExpenseDto.period);

    // Validate expense items
    this.validateExpenseItems(createExpenseDto.items);

    // Validate building exists and belongs to admin
    await this.validateBuildingAccess(
      createExpenseDto.buildingId,
      user.adminId,
    );
  }

  private async validateGenerateExpenseDto(
    generateExpenseDto: GenerateExpenseDto,
    user: RequestUser,
  ): Promise<void> {
    // Validate period format
    this.validatePeriodFormat(generateExpenseDto.period);

    // Validate future period
    this.validateNotFuturePeriod(generateExpenseDto.period);

    // Validate due date
    this.validateDueDate(generateExpenseDto.dueDate, generateExpenseDto.period);

    // Validate building exists and belongs to admin
    await this.validateBuildingAccess(
      generateExpenseDto.buildingId,
      user.adminId,
    );
  }

  private validatePeriodFormat(period: string): void {
    const periodRegex = /^\d{4}-\d{2}$/;
    if (!periodRegex.test(period)) {
      throw new InvalidPeriodFormatException(period);
    }

    const [year, month] = period.split('-');
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      throw new InvalidPeriodFormatException(period);
    }
  }

  private validateNotFuturePeriod(period: string): void {
    const [year, month] = period.split('-');
    const periodDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const currentDate = new Date();
    const currentPeriod = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    if (periodDate > currentPeriod) {
      throw new FuturePeriodException(period);
    }
  }

  private validateDueDate(dueDate: string, period: string): void {
    const [year, month] = period.split('-');
    const periodEndDate = new Date(parseInt(year), parseInt(month), 0); // Last day of the period month
    const dueDateObj = new Date(dueDate);

    if (dueDateObj <= periodEndDate) {
      throw new InvalidDueDateException(dueDate, period);
    }
  }

  private validateExpenseItems(items: any[]): void {
    if (!items || items.length === 0) {
      throw new EmptyExpenseItemsException();
    }

    for (const item of items) {
      if (!item.description || item.description.trim() === '') {
        throw new ExpenseItemDescriptionRequiredException();
      }

      if (!item.amount || item.amount <= 0) {
        throw new InvalidExpenseAmountException(item.amount);
      }
    }
  }

  private async validateBuildingAccess(
    buildingId: string,
    adminId: string,
  ): Promise<void> {
    const building = await this.buildingRepository.findOne({
      where: { id: buildingId, adminId },
    });

    if (!building) {
      throw new BuildingNotFoundOrUnauthorizedException(buildingId);
    }
  }

  private validateDistributionMethodCompatibility(
    method: ExpenseDistributionMethod,
    units: Unit[],
    buildingName?: string,
  ): void {
    switch (method) {
      case ExpenseDistributionMethod.BY_OWNERSHIP:
        const unitsWithoutOwnership = units.filter(
          (unit) => !unit.ownershipPercentage || unit.ownershipPercentage <= 0,
        );
        if (unitsWithoutOwnership.length > 0) {
          throw new InsufficientOwnershipDataException(buildingName);
        }
        break;

      case ExpenseDistributionMethod.BY_M2:
        const unitsWithoutM2 = units.filter((unit) => !unit.m2 || unit.m2 <= 0);
        if (unitsWithoutM2.length > 0) {
          throw new InsufficientM2DataException(buildingName);
        }
        break;

      case ExpenseDistributionMethod.EQUAL:
      case ExpenseDistributionMethod.CUSTOM:
        // No additional validation needed
        break;

      default:
        throw new InvalidDistributionMethodException(
          method,
          'Método de distribución no reconocido',
        );
    }
  }
}
