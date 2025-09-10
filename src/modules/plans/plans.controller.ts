import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { JwtAuthGuard, RolesGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { CreateMaintenanceTaskDto } from './dto';
import { PlansService } from './plans.service';

@ApiTags('Plans')
@ApiBearerAuth()
@Controller({ path: 'plans', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Get(':id/tasks')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.MAINTENANCE)
  @ApiOperation({ summary: 'Get maintenance plan tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  getTasks(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.plansService.getTasks(id, user);
  }

  @Post(':id/tasks')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create maintenance task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  createTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createTaskDto: CreateMaintenanceTaskDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.plansService.createTask(id, createTaskDto, user);
  }
}
