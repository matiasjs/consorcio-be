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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Permissions } from '../../../common/decorators';
import { PaginationDto } from '../../../common/dto';
import { JwtAuthGuard, PermissionsGuard } from '../../../common/guards';
import type { RequestUser } from '../../../common/interfaces';
import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from '../dto';
import { RolesService } from '../services/roles.service';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller({ path: 'auth/roles', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @Permissions('manageRoles')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 409, description: 'Role already exists' })
  create(@Body() createRoleDto: CreateRoleDto, @CurrentUser() user: RequestUser) {
    return this.rolesService.create(createRoleDto, user.adminId);
  }

  @Get()
  @Permissions('readRoles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  findAll(@Query() pagination: PaginationDto, @CurrentUser() user: RequestUser) {
    return this.rolesService.findAll(user.adminId, pagination);
  }

  @Get(':id')
  @Permissions('readRoles')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.rolesService.findOne(id, user.adminId);
  }

  @Patch(':id')
  @Permissions('manageRoles')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, user.adminId);
  }

  @Delete(':id')
  @Permissions('manageRoles')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.rolesService.remove(id, user.adminId);
  }

  @Post(':id/permissions')
  @Permissions('manageRoles')
  @ApiOperation({ summary: 'Assign permissions to role' })
  @ApiResponse({ status: 200, description: 'Permissions assigned successfully' })
  @ApiResponse({ status: 404, description: 'Role or permissions not found' })
  assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.rolesService.assignPermissions(id, assignPermissionsDto, user.adminId);
  }
}
