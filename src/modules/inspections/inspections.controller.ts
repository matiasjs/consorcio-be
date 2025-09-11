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
import { CreateInspectionDto, UpdateInspectionDto } from './dto';
import { InspectionsService } from './inspections.service';

@ApiTags('Inspections')
@ApiBearerAuth()
@Controller({ path: 'inspections', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.INSPECTOR,
  )
  @ApiOperation({ summary: 'Create a new inspection' })
  @ApiResponse({ status: 201, description: 'Inspection created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createInspectionDto: CreateInspectionDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.inspectionsService.create(createInspectionDto, user);
  }

  @Get()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.INSPECTOR,
  )
  @ApiOperation({ summary: 'Get all inspections' })
  @ApiResponse({
    status: 200,
    description: 'Inspections retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.inspectionsService.findAll(user, paginationDto);
  }

  @Get(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.INSPECTOR,
  )
  @ApiOperation({ summary: 'Get inspection by ID' })
  @ApiResponse({
    status: 200,
    description: 'Inspection retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.inspectionsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.INSPECTOR,
  )
  @ApiOperation({ summary: 'Update inspection' })
  @ApiResponse({ status: 200, description: 'Inspection updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.inspectionsService.update(id, updateInspectionDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Delete inspection' })
  @ApiResponse({ status: 200, description: 'Inspection deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.inspectionsService.remove(id, user);
  }
}
