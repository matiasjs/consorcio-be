import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  GenerateExpenseDto,
  UpdateExpenseDistributionDto,
} from './dto';
import { PaginationDto } from '../../common/dto';
import type { RequestUser } from '../../common/interfaces';
import { CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'expenses', version: '1' })
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense manually' })
  @ApiResponse({
    status: 201,
    description: 'Expense created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Expense already exists for this building and period',
  })
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Post('generate')
  @ApiOperation({
    summary: 'Generate expense automatically for a building and period',
  })
  @ApiResponse({
    status: 201,
    description: 'Expense generated successfully',
  })
  @ApiResponse({
    status: 409,
    description:
      'Expense already exists (use forceRegenerate=true to override)',
  })
  generateExpense(
    @Body() generateExpenseDto: GenerateExpenseDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.expensesService.generateExpense(generateExpenseDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({
    status: 200,
    description: 'List of expenses retrieved successfully',
  })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.expensesService.findAll(user, paginationDto);
  }

  @Get('building/:buildingId')
  @ApiOperation({ summary: 'Get all expenses for a specific building' })
  @ApiResponse({
    status: 200,
    description: 'Building expenses retrieved successfully',
  })
  getExpensesByBuilding(
    @Param('buildingId') buildingId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.expensesService.getExpensesByBuilding(buildingId, user);
  }

  @Get('period/:period')
  @ApiOperation({ summary: 'Get all expenses for a specific period (YYYY-MM)' })
  @ApiResponse({
    status: 200,
    description: 'Period expenses retrieved successfully',
  })
  getExpensesByPeriod(
    @Param('period') period: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.expensesService.getExpensesByPeriod(period, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID with full details' })
  @ApiResponse({
    status: 200,
    description: 'Expense retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense not found',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.expensesService.findOne(id, user);
  }

  @Get(':id/distributions')
  @ApiOperation({ summary: 'Get expense distributions by unit' })
  @ApiResponse({
    status: 200,
    description: 'Expense distributions retrieved successfully',
  })
  getDistributions(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.expensesService.getDistributions(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.expensesService.update(id, updateExpenseDto, user);
  }

  @Patch(':expenseId/distributions/:unitId')
  @ApiOperation({ summary: 'Update expense distribution (mark as paid, etc.)' })
  @ApiResponse({
    status: 200,
    description: 'Distribution updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Distribution not found',
  })
  updateDistribution(
    @Param('expenseId') expenseId: string,
    @Param('unitId') unitId: string,
    @Body() updateDto: UpdateExpenseDistributionDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.expensesService.updateDistribution(
      expenseId,
      unitId,
      updateDto,
      user,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense not found',
  })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.expensesService.remove(id, user);
  }
}
