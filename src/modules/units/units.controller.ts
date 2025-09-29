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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import type { RequestUser } from '../../common/interfaces/request-user.interface';
import { CreateUnitDto, CreateUnitOccupancyDto, UpdateUnitDto } from './dto';
import { UnitsService } from './units.service';

@ApiTags('units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller({ path: 'units', version: '1' })
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @Permissions('manageUnits')
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  create(
    @Body() createUnitDto: CreateUnitDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.unitsService.create(createUnitDto, currentUser.adminId);
  }

  @Get()
  @Permissions('manageUnits')
  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({ status: 200, description: 'Units retrieved successfully' })
  @ApiQuery({ name: 'buildingId', required: false, type: String })
  findAll(
    @CurrentUser() currentUser: RequestUser,
    @Query('buildingId') buildingId?: string,
  ) {
    return this.unitsService.findAll(currentUser.adminId, buildingId);
  }

  @Get(':id')
  @Permissions('manageUnits')
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiResponse({ status: 200, description: 'Unit retrieved successfully' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.unitsService.findOne(id, currentUser.adminId);
  }

  @Patch(':id')
  @Permissions('manageUnits')
  @ApiOperation({ summary: 'Update unit' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.unitsService.update(id, updateUnitDto, currentUser.adminId);
  }

  @Delete(':id')
  @Permissions('manageUnits')
  @ApiOperation({ summary: 'Delete unit' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.unitsService.remove(id, currentUser.adminId);
  }

  @Post(':id/occupancy')
  @Permissions('managePeople')
  @ApiOperation({ summary: 'Create unit occupancy' })
  @ApiResponse({
    status: 201,
    description: 'Unit occupancy created successfully',
  })
  createOccupancy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createOccupancyDto: CreateUnitOccupancyDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.unitsService.createOccupancy(
      id,
      createOccupancyDto,
      currentUser.adminId,
    );
  }

  @Get(':id/occupancy')
  @Permissions('managePeople')
  @ApiOperation({ summary: 'Get unit occupancy' })
  @ApiResponse({
    status: 200,
    description: 'Unit occupancy retrieved successfully',
  })
  getOccupancy(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.unitsService.getOccupancy(id, currentUser.adminId);
  }
}
