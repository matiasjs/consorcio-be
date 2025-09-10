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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TicketStatus } from '../../entities/ticket.entity';
import { AssignInspectorDto, CreateTicketDto, UpdateTicketDto } from './dto';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Controller({ path: 'tickets', version: '1' })
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.OWNER,
    UserRole.TENANT,
    UserRole.PORTER,
  )
  create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: any,
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
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.INSPECTOR,
    UserRole.VENDOR,
  )
  findAll(
    @CurrentUser() user: any,
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
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
  )
  getStats(@CurrentUser() user: any) {
    return this.ticketsService.getTicketsByStatus(user.adminId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.OWNER,
    UserRole.TENANT,
    UserRole.INSPECTOR,
    UserRole.VENDOR,
  )
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.findOne(id, user.adminId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.INSPECTOR,
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.update(id, updateTicketDto, user.adminId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.remove(id, user.adminId);
  }

  @Post(':id/assign-inspector')
  @ApiOperation({ summary: 'Assign an inspector to a ticket' })
  @ApiResponse({ status: 201, description: 'Inspector assigned successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  assignInspector(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignInspectorDto: AssignInspectorDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.assignInspector(id, assignInspectorDto, user.adminId);
  }
}
