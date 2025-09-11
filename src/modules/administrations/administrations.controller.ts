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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../../common/enums';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { AdministrationsService } from './administrations.service';
import { CreateAdministrationDto, UpdateAdministrationDto } from './dto';

@ApiTags('Administrations')
@Controller({ path: 'administrations', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdministrationsController {
  constructor(
    private readonly administrationsService: AdministrationsService,
  ) {}

  @Post()
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Create a new administration' })
  @ApiResponse({
    status: 201,
    description: 'Administration created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Administration with CUIT or email already exists',
  })
  create(@Body() createAdministrationDto: CreateAdministrationDto) {
    return this.administrationsService.create(createAdministrationDto);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Get all administrations' })
  @ApiResponse({
    status: 200,
    description: 'Administrations retrieved successfully',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.administrationsService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Get administration by ID' })
  @ApiParam({ name: 'id', description: 'Administration ID' })
  @ApiResponse({
    status: 200,
    description: 'Administration retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Administration not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.administrationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)
  @ApiOperation({ summary: 'Update administration' })
  @ApiParam({ name: 'id', description: 'Administration ID' })
  @ApiResponse({
    status: 200,
    description: 'Administration updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Administration not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdministrationDto: UpdateAdministrationDto,
  ) {
    return this.administrationsService.update(id, updateAdministrationDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Delete administration' })
  @ApiParam({ name: 'id', description: 'Administration ID' })
  @ApiResponse({
    status: 200,
    description: 'Administration deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Administration not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.administrationsService.remove(id);
  }
}
