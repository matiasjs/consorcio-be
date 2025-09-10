import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { User } from '../../entities/user.entity';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto';

@ApiTags('buildings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller({ path: 'buildings', version: '1' })
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) { }

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Create a new building' })
  @ApiResponse({ status: 201, description: 'Building created successfully' })
  create(
    @Body() createBuildingDto: CreateBuildingDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.buildingsService.create(createBuildingDto, currentUser.adminId);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all buildings' })
  @ApiResponse({ status: 200, description: 'Buildings retrieved successfully' })
  findAll(@CurrentUser() currentUser: User) {
    return this.buildingsService.findAll(currentUser.adminId);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get building by ID' })
  @ApiResponse({ status: 200, description: 'Building retrieved successfully' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.buildingsService.findOne(id, currentUser.adminId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Update building' })
  @ApiResponse({ status: 200, description: 'Building updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.buildingsService.update(id, updateBuildingDto, currentUser.adminId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Delete building' })
  @ApiResponse({ status: 200, description: 'Building deleted successfully' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.buildingsService.remove(id, currentUser.adminId);
  }
}
