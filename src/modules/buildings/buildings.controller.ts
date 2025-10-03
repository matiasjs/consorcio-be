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
import { CurrentUser, Permissions } from '../../common/decorators';
import {
  JwtAuthGuard,
  PermissionsGuard,
  TenantGuard,
} from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto';

@ApiTags('buildings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller({ path: 'buildings', version: '1' })
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @Permissions('manageBuildings')
  @ApiOperation({ summary: 'Create a new building' })
  @ApiResponse({ status: 201, description: 'Building created successfully' })
  create(
    @Body() createBuildingDto: CreateBuildingDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.buildingsService.create(createBuildingDto, currentUser.adminId);
  }

  @Get()
  @Permissions('manageBuildings', 'readBilling') // Permitir también a usuarios con readBilling
  @ApiOperation({ summary: 'Get all buildings' })
  @ApiResponse({ status: 200, description: 'Buildings retrieved successfully' })
  findAll(@CurrentUser() currentUser: RequestUser) {
    return this.buildingsService.findAll(currentUser.adminId);
  }

  @Get(':id')
  @Permissions('manageBuildings', 'readBilling') // Permitir también a usuarios con readBilling
  @ApiOperation({ summary: 'Get building by ID' })
  @ApiResponse({ status: 200, description: 'Building retrieved successfully' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.buildingsService.findOne(id, currentUser.adminId);
  }

  @Patch(':id')
  @Permissions('manageBuildings')
  @ApiOperation({ summary: 'Update building' })
  @ApiResponse({ status: 200, description: 'Building updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.buildingsService.update(
      id,
      updateBuildingDto,
      currentUser.adminId,
    );
  }

  @Delete(':id')
  @Permissions('manageBuildings')
  @ApiOperation({ summary: 'Delete building' })
  @ApiResponse({ status: 200, description: 'Building deleted successfully' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.buildingsService.remove(id, currentUser.adminId);
  }
}
