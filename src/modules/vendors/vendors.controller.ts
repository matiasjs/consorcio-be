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
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { User } from '../../entities/user.entity';
import {
  CreateVendorAvailabilityDto,
  CreateVendorDto,
  UpdateVendorAvailabilityDto,
  UpdateVendorDto,
} from './dto';
import { VendorsService } from './vendors.service';

@ApiTags('vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller({ path: 'vendors', version: '1' })
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Permissions('manageVendors')
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  create(
    @Body() createVendorDto: CreateVendorDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.create(createVendorDto, currentUser.adminId);
  }

  @Get()
  @Permissions('manageVendors', 'readWorkOrder') // Permitir también a usuarios que pueden leer work orders
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiQuery({ name: 'trade', required: false, description: 'Filter by trade' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  findAll(@CurrentUser() currentUser: User, @Query('trade') trade?: string) {
    return this.vendorsService.findAll(currentUser.adminId, trade);
  }

  @Get(':id')
  @Permissions('manageVendors', 'readWorkOrder')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.findOne(id, currentUser.adminId);
  }

  @Patch(':id')
  @Permissions('manageVendors')
  @ApiOperation({ summary: 'Update vendor' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.update(id, updateVendorDto, currentUser.adminId);
  }

  @Delete(':id')
  @Permissions('manageVendors')
  @ApiOperation({ summary: 'Delete vendor' })
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.remove(id, currentUser.adminId);
  }

  @Post(':id/availability')
  @Permissions('manageVendors')
  @ApiOperation({ summary: 'Create vendor availability' })
  @ApiResponse({
    status: 201,
    description: 'Vendor availability created successfully',
  })
  createAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createAvailabilityDto: CreateVendorAvailabilityDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.createAvailability(
      id,
      createAvailabilityDto,
      currentUser.adminId,
    );
  }

  @Get(':id/availability')
  @Permissions('manageVendors', 'readWorkOrder')
  @ApiOperation({ summary: 'Get vendor availability' })
  @ApiResponse({
    status: 200,
    description: 'Vendor availability retrieved successfully',
  })
  getAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.getAvailabilities(id, currentUser.adminId);
  }

  @Patch(':id/availability/:availabilityId')
  @Permissions('manageVendors')
  @ApiOperation({ summary: 'Update vendor availability' })
  @ApiResponse({
    status: 200,
    description: 'Vendor availability updated successfully',
  })
  updateAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('availabilityId', ParseUUIDPipe) availabilityId: string,
    @Body() updateAvailabilityDto: UpdateVendorAvailabilityDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.updateAvailability(
      id,
      availabilityId,
      updateAvailabilityDto,
      currentUser.adminId,
    );
  }

  @Delete(':id/availability/:availabilityId')
  @Permissions('manageVendors')
  @ApiOperation({ summary: 'Delete vendor availability' })
  @ApiResponse({
    status: 200,
    description: 'Vendor availability deleted successfully',
  })
  removeAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('availabilityId', ParseUUIDPipe) availabilityId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.vendorsService.removeAvailability(
      id,
      availabilityId,
      currentUser.adminId,
    );
  }
}
