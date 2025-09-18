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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../../common/enums';
import { JwtAuthGuard, RolesGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { AssetsService } from './assets.service';
import {
  CreateAssetDto,
  CreateMaintenancePlanDto,
  UpdateAssetDto,
} from './dto';

@ApiTags('Assets')
@ApiBearerAuth()
@Controller({ path: 'assets', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  create(
    @Body() createAssetDto: CreateAssetDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assetsService.create(createAssetDto, user);
  }

  @Get()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.MAINTENANCE,
  )
  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({ status: 200, description: 'Assets retrieved successfully' })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.assetsService.findAll(user, paginationDto);
  }

  @Get(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.MAINTENANCE,
  )
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({ status: 200, description: 'Asset retrieved successfully' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assetsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assetsService.update(id, updateAssetDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Delete asset' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assetsService.remove(id, user);
  }

  @Get(':id/plans')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.MAINTENANCE,
  )
  @ApiOperation({ summary: 'Get asset maintenance plans' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance plans retrieved successfully',
  })
  getMaintenancePlans(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assetsService.getMaintenancePlans(id, user);
  }

  @Post(':id/plans')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create asset maintenance plan' })
  @ApiResponse({
    status: 201,
    description: 'Maintenance plan created successfully',
  })
  createMaintenancePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createPlanDto: CreateMaintenancePlanDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assetsService.createMaintenancePlan(id, createPlanDto, user);
  }
}
