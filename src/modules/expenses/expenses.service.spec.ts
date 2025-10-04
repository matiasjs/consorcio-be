import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import {
  Expense,
  ExpenseItem,
  ExpenseDistribution,
  Unit,
  VendorInvoice,
  Building,
  ExpenseStatus,
  ExpenseDistributionMethod,
  ExpenseItemType,
  ExpenseItemCategory,
} from '../../entities';
import { CreateExpenseDto, GenerateExpenseDto } from './dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expenseRepository: Repository<Expense>;
  let expenseItemRepository: Repository<ExpenseItem>;
  let expenseDistributionRepository: Repository<ExpenseDistribution>;
  let unitRepository: Repository<Unit>;
  let vendorInvoiceRepository: Repository<VendorInvoice>;
  let buildingRepository: Repository<Building>;

  const mockUser = {
    id: 'user-1',
    adminId: 'admin-1',
    email: 'test@example.com',
  };

  const mockBuilding = {
    id: 'building-1',
    adminId: 'admin-1',
    name: 'Test Building',
    address: 'Test Address',
    city: 'Test City',
  };

  const mockUnits = [
    {
      id: 'unit-1',
      buildingId: 'building-1',
      label: '1A',
      m2: 50,
      ownershipPercentage: 25,
      isActive: true,
      occupancies: [],
    },
    {
      id: 'unit-2',
      buildingId: 'building-1',
      label: '1B',
      m2: 75,
      ownershipPercentage: 37.5,
      isActive: true,
      occupancies: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ExpenseItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ExpenseDistribution),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Unit),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(VendorInvoice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Building),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    expenseRepository = module.get<Repository<Expense>>(
      getRepositoryToken(Expense),
    );
    expenseItemRepository = module.get<Repository<ExpenseItem>>(
      getRepositoryToken(ExpenseItem),
    );
    expenseDistributionRepository = module.get<Repository<ExpenseDistribution>>(
      getRepositoryToken(ExpenseDistribution),
    );
    unitRepository = module.get<Repository<Unit>>(getRepositoryToken(Unit));
    vendorInvoiceRepository = module.get<Repository<VendorInvoice>>(
      getRepositoryToken(VendorInvoice),
    );
    buildingRepository = module.get<Repository<Building>>(
      getRepositoryToken(Building),
    );
  });

  describe('create', () => {
    it('should create a new expense successfully', async () => {
      const createExpenseDto: CreateExpenseDto = {
        buildingId: 'building-1',
        period: '2024-01',
        title: 'Expensas Enero 2024',
        dueDate: '2024-02-15',
        items: [
          {
            description: 'Sueldo portero',
            type: ExpenseItemType.RECURRING,
            category: ExpenseItemCategory.STAFF_SALARIES,
            amount: 85000,
          },
        ],
      };

      const mockExpense = {
        id: 'expense-1',
        ...createExpenseDto,
        adminId: 'admin-1',
        totalAmount: 85000,
        status: ExpenseStatus.DRAFT,
        distributionMethod: ExpenseDistributionMethod.EQUAL,
      };

      // Mock for checking if expense already exists (should return null for new expense)
      jest
        .spyOn(expenseRepository, 'findOne')
        .mockResolvedValueOnce(null) // First call for duplicate check
        .mockResolvedValue(mockExpense as any); // Subsequent calls for generateDistributions

      jest
        .spyOn(buildingRepository, 'findOne')
        .mockResolvedValue(mockBuilding as any);
      const createSpy = jest
        .spyOn(expenseRepository, 'create')
        .mockReturnValue(mockExpense as any);
      jest
        .spyOn(expenseRepository, 'save')
        .mockResolvedValue(mockExpense as any);
      jest.spyOn(expenseItemRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(expenseItemRepository, 'save').mockResolvedValue([]);
      jest.spyOn(unitRepository, 'find').mockResolvedValue(mockUnits as any);
      jest
        .spyOn(expenseDistributionRepository, 'create')
        .mockReturnValue({} as any);
      jest.spyOn(expenseDistributionRepository, 'save').mockResolvedValue([]);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockExpense as any);

      const result = await service.create(createExpenseDto, mockUser as any);

      expect(result).toEqual(mockExpense);
      expect(createSpy).toHaveBeenCalledWith({
        ...createExpenseDto,
        adminId: 'admin-1',
        totalAmount: 85000,
        dueDate: new Date(createExpenseDto.dueDate),
        currency: 'ARS',
        distributionMethod: ExpenseDistributionMethod.EQUAL,
        description: `Expensas correspondientes al período ${createExpenseDto.title}`,
      });
    });

    it('should add items to existing expense if expense already exists', async () => {
      const createExpenseDto: CreateExpenseDto = {
        buildingId: 'building-1',
        period: '2024-01',
        title: 'Expensas Enero 2024',
        dueDate: '2024-02-15',
        items: [
          {
            description: 'Sueldo portero',
            type: ExpenseItemType.RECURRING,
            category: ExpenseItemCategory.STAFF_SALARIES,
            amount: 85000,
          },
        ],
      };

      const existingExpense = {
        id: 'existing-expense-1',
        buildingId: 'building-1',
        period: '2024-01',
        adminId: 'admin-1',
        items: [],
        totalAmount: 0,
        distributionMethod: ExpenseDistributionMethod.EQUAL,
      };

      jest
        .spyOn(expenseRepository, 'findOne')
        .mockResolvedValue(existingExpense as any);
      jest
        .spyOn(buildingRepository, 'findOne')
        .mockResolvedValue(mockBuilding as any);
      const createItemSpy = jest
        .spyOn(expenseItemRepository, 'create')
        .mockReturnValue({} as any);
      jest.spyOn(expenseItemRepository, 'save').mockResolvedValue([]);
      jest
        .spyOn(expenseRepository, 'save')
        .mockResolvedValue(existingExpense as any);
      jest
        .spyOn(expenseDistributionRepository, 'delete')
        .mockResolvedValue({} as any);
      jest.spyOn(unitRepository, 'find').mockResolvedValue(mockUnits as any);
      jest
        .spyOn(expenseDistributionRepository, 'create')
        .mockReturnValue({} as any);
      jest.spyOn(expenseDistributionRepository, 'save').mockResolvedValue([]);
      jest.spyOn(service, 'findOne').mockResolvedValue(existingExpense as any);

      const result = await service.create(createExpenseDto, mockUser as any);

      expect(result).toEqual(existingExpense);
      expect(createItemSpy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if building not found', async () => {
      const createExpenseDto: CreateExpenseDto = {
        buildingId: 'building-1',
        period: '2024-01',
        title: 'Expensas Enero 2024',
        dueDate: '2024-02-15',
        items: [
          {
            description: 'Sueldo portero',
            type: ExpenseItemType.RECURRING,
            category: ExpenseItemCategory.STAFF_SALARIES,
            amount: 85000,
          },
        ],
      };

      jest.spyOn(expenseRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(buildingRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.create(createExpenseDto, mockUser as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateExpense', () => {
    it('should generate expense with default items', async () => {
      const generateExpenseDto: GenerateExpenseDto = {
        buildingId: 'building-1',
        period: '2024-01',
        dueDate: '2024-02-15',
      };

      jest.spyOn(expenseRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(buildingRepository, 'findOne')
        .mockResolvedValue(mockBuilding as any);
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue({} as any);

      const queryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      jest
        .spyOn(vendorInvoiceRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      await service.generateExpense(generateExpenseDto, mockUser as any);

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          buildingId: 'building-1',
          period: '2024-01',
          title: 'Expensas Enero 2024',
          items: expect.arrayContaining([
            expect.objectContaining({
              description: 'Sueldo portero',
              type: ExpenseItemType.RECURRING,
              category: ExpenseItemCategory.STAFF_SALARIES,
            }),
          ]),
        }),
        mockUser,
      );
    });

    it('should throw ConflictException if expense exists and forceRegenerate is false', async () => {
      const generateExpenseDto: GenerateExpenseDto = {
        buildingId: 'building-1',
        period: '2024-01',
        dueDate: '2024-02-15',
        forceRegenerate: false,
      };

      jest.spyOn(expenseRepository, 'findOne').mockResolvedValue({} as any);
      jest
        .spyOn(buildingRepository, 'findOne')
        .mockResolvedValue(mockBuilding as any);

      await expect(
        service.generateExpense(generateExpenseDto, mockUser as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return expense with relations', async () => {
      const mockExpense = {
        id: 'expense-1',
        adminId: 'admin-1',
        buildingId: 'building-1',
      };

      const findOneSpy = jest
        .spyOn(expenseRepository, 'findOne')
        .mockResolvedValue(mockExpense as any);

      const result = await service.findOne('expense-1', mockUser as any);

      expect(result).toEqual(mockExpense);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 'expense-1', adminId: 'admin-1' },
        relations: ['building', 'items', 'distributions', 'distributions.unit'],
      });
    });

    it('should throw NotFoundException if expense not found', async () => {
      jest.spyOn(expenseRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne('expense-1', mockUser as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
