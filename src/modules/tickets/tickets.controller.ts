import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Permissions } from '../../common/decorators';
import { JwtAuthGuard, PermissionsGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { TicketStatus } from '../../entities/ticket.entity';
import { AssignInspectorDto, CreateTicketDto, UpdateTicketDto } from './dto';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantGuard)
@Controller({ path: 'tickets', version: '1' })
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  @Permissions('createWorkOrder')
  create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.ticketsService.create(createTicketDto, user.id, user.adminId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  @ApiQuery({ name: 'buildingId', required: false, type: String })
  @ApiQuery({ name: 'unitId', required: false, type: String })
  @Permissions('readWorkOrder')
  findAll(
    @CurrentUser() user: RequestUser,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: TicketStatus,
    @Query('buildingId') buildingId?: string,
    @Query('unitId') unitId?: string,
  ) {
    return this.ticketsService.findAll(
      user.adminId,
      page,
      limit,
      status,
      buildingId,
      unitId,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get ticket statistics by status' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @Permissions('readWorkOrder')
  getStats(@CurrentUser() user: RequestUser) {
    return this.ticketsService.getTicketsByStatus(user.adminId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Permissions('readWorkOrder')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.ticketsService.findOne(id, user.adminId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Permissions('updateWorkOrder')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.ticketsService.update(id, updateTicketDto, user.adminId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Permissions('updateWorkOrder')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.ticketsService.remove(id, user.adminId);
  }

  @Post(':id/assign-inspector')
  @ApiOperation({ summary: 'Assign an inspector to a ticket' })
  @ApiResponse({ status: 201, description: 'Inspector assigned successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Permissions('updateWorkOrder')
  assignInspector(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignInspectorDto: AssignInspectorDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.ticketsService.assignInspector(id, assignInspectorDto, user.adminId);
  }
}
