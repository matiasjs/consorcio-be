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
import { CurrentUser, Permissions } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../../common/enums';
import {
  JwtAuthGuard,
  PermissionsGuard,
  TenantGuard,
} from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import {
  AddMaterialDto,
  CreateQuoteDto,
  CreateScheduleDto,
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
} from './dto';
import { WorkOrdersService } from './workorders.service';

@ApiTags('Work Orders')
@ApiBearerAuth()
@Controller({ path: 'workorders', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @Permissions('createWorkOrder')
  @ApiOperation({ summary: 'Create a new work order' })
  @ApiResponse({ status: 201, description: 'Work order created successfully' })
  create(
    @Body() createWorkOrderDto: CreateWorkOrderDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.create(createWorkOrderDto, user);
  }

  @Get()
  @Permissions('readWorkOrder')
  @ApiOperation({ summary: 'Get all work orders' })
  @ApiResponse({
    status: 200,
    description: 'Work orders retrieved successfully',
  })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.workOrdersService.findAll(user, paginationDto);
  }

  @Get(':id')
  @Permissions('readWorkOrder')
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Work order retrieved successfully',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.findOne(id, user);
  }

  @Patch(':id')
  @Permissions('updateWorkOrder')
  @ApiOperation({ summary: 'Update work order' })
  @ApiResponse({ status: 200, description: 'Work order updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.update(id, updateWorkOrderDto, user);
  }

  @Delete(':id')
  @Permissions('updateWorkOrder') // Solo admin/secretaria pueden eliminar
  @ApiOperation({ summary: 'Delete work order' })
  @ApiResponse({ status: 200, description: 'Work order deleted successfully' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.remove(id, user);
  }

  // Quote endpoints
  @Get(':id/quotes')
  @Permissions('readWorkOrder')
  @ApiOperation({ summary: 'Get work order quotes' })
  @ApiResponse({ status: 200, description: 'Quotes retrieved successfully' })
  getQuotes(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.getQuotes(id, user);
  }

  @Post(':id/quotes')
  @Permissions('updateWorkOrder') // Solo provider y admin pueden crear quotes
  @ApiOperation({ summary: 'Create work order quote' })
  @ApiResponse({ status: 201, description: 'Quote created successfully' })
  createQuote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createQuoteDto: CreateQuoteDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.createQuote(id, createQuoteDto, user);
  }

  // Schedule endpoints
  @Post(':id/schedules')
  @Permissions('updateWorkOrder')
  @ApiOperation({ summary: 'Create work order schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  createSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.createSchedule(id, createScheduleDto, user);
  }

  // Material endpoints
  @Get(':id/materials')
  @Permissions('readWorkOrder')
  @ApiOperation({ summary: 'Get work order materials' })
  @ApiResponse({ status: 200, description: 'Materials retrieved successfully' })
  getMaterials(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.getMaterials(id, user);
  }

  @Post(':id/materials')
  @Permissions('updateWorkOrder')
  @ApiOperation({ summary: 'Add material to work order' })
  @ApiResponse({ status: 201, description: 'Material added successfully' })
  addMaterial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addMaterialDto: AddMaterialDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workOrdersService.addMaterial(id, addMaterialDto, user);
  }
}
