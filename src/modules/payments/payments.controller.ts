import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../../common/enums';
import { JwtAuthGuard, RolesGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller({ path: 'payments', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Get()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.paymentsService.findAll(user, paginationDto);
  }

  @Get('stats/status')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Get payment statistics by status' })
  @ApiResponse({
    status: 200,
    description: 'Payment statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getTotalsByStatus(@CurrentUser() user: RequestUser) {
    return this.paymentsService.getTotalsByStatus(user);
  }

  @Get('stats/method')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Get payment statistics by method' })
  @ApiResponse({
    status: 200,
    description: 'Payment statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getTotalsByMethod(@CurrentUser() user: RequestUser) {
    return this.paymentsService.getTotalsByMethod(user);
  }

  @Get('status/:status')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Get payments by status' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByStatus(
    @Param('status') status: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.paymentsService.findByStatus(status, user);
  }

  @Get('method/:method')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Get payments by method' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByMethod(
    @Param('method') method: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.paymentsService.findByMethod(method, user);
  }

  @Get(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.paymentsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.paymentsService.update(id, updatePaymentDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.paymentsService.remove(id, user);
  }
}
