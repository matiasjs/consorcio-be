import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../../common/enums';
import { JwtAuthGuard, RolesGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { CreateAuditLogDto } from './dto';
import { AuditLogsService } from './audit-logs.service';

@ApiTags('Audit Logs')
@Controller({ path: 'audit-logs', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@ApiBearerAuth()
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit log entry' })
  @ApiResponse({ status: 201, description: 'Audit log created successfully' })
  create(@Body() createAuditLogDto: CreateAuditLogDto, @CurrentUser() user: RequestUser) {
    return this.auditLogsService.create(createAuditLogDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all audit logs' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  findAll(@CurrentUser() user: RequestUser, @Query() paginationDto: PaginationDto) {
    return this.auditLogsService.findAll(user, paginationDto);
  }

  @Get('stats/by-action')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get audit statistics by action' })
  @ApiResponse({ status: 200, description: 'Audit statistics retrieved successfully' })
  getStatsByAction(@CurrentUser() user: RequestUser) {
    return this.auditLogsService.getStatsByAction(user);
  }

  @Get('stats/by-entity-type')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get audit statistics by entity type' })
  @ApiResponse({ status: 200, description: 'Audit statistics retrieved successfully' })
  getStatsByEntityType(@CurrentUser() user: RequestUser) {
    return this.auditLogsService.getStatsByEntityType(user);
  }

  @Get('entity/:entityType/:entityId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get audit logs by entity' })
  @ApiResponse({ status: 200, description: 'Entity audit logs retrieved successfully' })
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @CurrentUser() user: RequestUser
  ) {
    return this.auditLogsService.findByEntity(entityType, entityId, user);
  }

  @Get('user/:userId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get audit logs by user' })
  @ApiResponse({ status: 200, description: 'User audit logs retrieved successfully' })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string, @CurrentUser() user: RequestUser) {
    return this.auditLogsService.findByUser(userId, user);
  }

  @Get('action/:action')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get audit logs by action' })
  @ApiResponse({ status: 200, description: 'Action audit logs retrieved successfully' })
  findByAction(@Param('action') action: string, @CurrentUser() user: RequestUser) {
    return this.auditLogsService.findByAction(action, user);
  }

  @Get('date-range')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get audit logs by date range' })
  @ApiResponse({ status: 200, description: 'Date range audit logs retrieved successfully' })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: RequestUser
  ) {
    return this.auditLogsService.findByDateRange(startDate, endDate, user);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.auditLogsService.findOne(id, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Delete audit log' })
  @ApiResponse({ status: 200, description: 'Audit log deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.auditLogsService.remove(id, user);
  }
}
