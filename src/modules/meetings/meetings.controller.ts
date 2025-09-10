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
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../../common/enums';
import { JwtAuthGuard, RolesGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { CreateMeetingDto, CreateResolutionDto, UpdateMeetingDto } from './dto';
import { MeetingsService } from './meetings.service';

@ApiTags('Meetings')
@ApiBearerAuth()
@Controller({ path: 'meetings', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) { }

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new meeting' })
  @ApiResponse({ status: 201, description: 'Meeting created successfully' })
  create(@Body() createMeetingDto: CreateMeetingDto, @CurrentUser() user: RequestUser) {
    return this.meetingsService.create(createMeetingDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get all meetings' })
  @ApiResponse({ status: 200, description: 'Meetings retrieved successfully' })
  findAll(@CurrentUser() user: RequestUser, @Query() paginationDto: PaginationDto) {
    return this.meetingsService.findAll(user, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get meeting by ID' })
  @ApiResponse({ status: 200, description: 'Meeting retrieved successfully' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.meetingsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update meeting' })
  @ApiResponse({ status: 200, description: 'Meeting updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.meetingsService.update(id, updateMeetingDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Delete meeting' })
  @ApiResponse({ status: 200, description: 'Meeting deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.meetingsService.remove(id, user);
  }

  @Get(':id/resolutions')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get meeting resolutions' })
  @ApiResponse({ status: 200, description: 'Resolutions retrieved successfully' })
  getResolutions(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.meetingsService.getResolutions(id, user);
  }

  @Post(':id/resolutions')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create meeting resolution' })
  @ApiResponse({ status: 201, description: 'Resolution created successfully' })
  createResolution(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createResolutionDto: CreateResolutionDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.meetingsService.createResolution(id, createResolutionDto, user);
  }
}
