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
import { CreateUnitDto, CreateUnitOccupancyDto, UpdateUnitDto } from './dto';
import { UnitsService } from './units.service';

@ApiTags('units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller({ path: 'units', version: '1' })
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) { }

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  create(
    @Body() createUnitDto: CreateUnitDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.unitsService.create(createUnitDto, currentUser.adminId);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({ status: 200, description: 'Units retrieved successfully' })
  findAll(@CurrentUser() currentUser: User) {
    return this.unitsService.findAll(currentUser.adminId);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiResponse({ status: 200, description: 'Unit retrieved successfully' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.unitsService.findOne(id, currentUser.adminId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Update unit' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.unitsService.update(id, updateUnitDto, currentUser.adminId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Delete unit' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.unitsService.remove(id, currentUser.adminId);
  }

  @Post(':id/occupancy')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Create unit occupancy' })
  @ApiResponse({ status: 201, description: 'Unit occupancy created successfully' })
  createOccupancy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createOccupancyDto: CreateUnitOccupancyDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.unitsService.createOccupancy(id, createOccupancyDto, currentUser.adminId);
  }

  @Get(':id/occupancy')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get unit occupancy' })
  @ApiResponse({ status: 200, description: 'Unit occupancy retrieved successfully' })
  getOccupancy(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.unitsService.getOccupancy(id, currentUser.adminId);
  }
}
