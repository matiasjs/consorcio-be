import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { CreateUsageMetricDto } from './dto';
import { UsageMetricsService } from './usage-metrics.service';

@ApiTags('Usage Metrics')
@Controller({ path: 'usage-metrics', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@ApiBearerAuth()
export class UsageMetricsController {
  constructor(private readonly usageMetricsService: UsageMetricsService) {}

  @Post()
  @ApiOperation({ summary: 'Create usage metric' })
  @ApiResponse({
    status: 201,
    description: 'Usage metric created successfully',
  })
  create(
    @Body() createUsageMetricDto: CreateUsageMetricDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usageMetricsService.create(createUsageMetricDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all usage metrics' })
  @ApiResponse({
    status: 200,
    description: 'Usage metrics retrieved successfully',
  })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.usageMetricsService.findAll(user, paginationDto);
  }

  @Get('stats/by-type')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get usage statistics by type' })
  @ApiResponse({
    status: 200,
    description: 'Usage statistics retrieved successfully',
  })
  getStatsByType(@CurrentUser() user: RequestUser) {
    return this.usageMetricsService.getStatsByType(user);
  }

  @Get('stats/by-date-range')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get usage statistics by date range' })
  @ApiResponse({
    status: 200,
    description: 'Usage statistics retrieved successfully',
  })
  getStatsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usageMetricsService.getStatsByDateRange(
      startDate,
      endDate,
      user,
    );
  }

  @Get('type/:type')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get usage metrics by type' })
  @ApiResponse({
    status: 200,
    description: 'Usage metrics retrieved successfully',
  })
  findByType(@Param('type') type: string, @CurrentUser() user: RequestUser) {
    return this.usageMetricsService.findByType(type, user);
  }

  @Get('user/:userId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get usage metrics by user' })
  @ApiResponse({
    status: 200,
    description: 'Usage metrics retrieved successfully',
  })
  findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usageMetricsService.findByUser(userId, user);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get usage metric by ID' })
  @ApiResponse({
    status: 200,
    description: 'Usage metric retrieved successfully',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usageMetricsService.findOne(id, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Delete usage metric' })
  @ApiResponse({
    status: 200,
    description: 'Usage metric deleted successfully',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usageMetricsService.remove(id, user);
  }
}
