import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Permissions } from '../../../common/decorators';
import { JwtAuthGuard, PermissionsGuard } from '../../../common/guards';
import type { RequestUser } from '../../../common/interfaces';
import { AssignRolesDto } from '../dto';
import { UserRolesService } from '../services/user-roles.service';

@ApiTags('User Roles')
@ApiBearerAuth()
@Controller({ path: 'auth/users', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post(':id/roles')
  @Permissions('allUsers')
  @ApiOperation({ summary: 'Assign roles to user' })
  @ApiResponse({ status: 200, description: 'Roles assigned successfully' })
  @ApiResponse({ status: 404, description: 'User or roles not found' })
  assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignRolesDto: AssignRolesDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.userRolesService.assignRoles(id, assignRolesDto, user.adminId);
  }

  @Get(':id/roles')
  @Permissions('readUsers')
  @ApiOperation({ summary: 'Get user with roles and permissions' })
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.userRolesService.getUserWithRoles(id, user.adminId);
  }
}
