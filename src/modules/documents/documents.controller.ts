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
import { RequestUser } from '../../common/interfaces';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller({ path: 'documents', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  create(@Body() createDocumentDto: CreateDocumentDto, @CurrentUser() user: RequestUser) {
    return this.documentsService.create(createDocumentDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  findAll(@CurrentUser() user: RequestUser, @Query() paginationDto: PaginationDto) {
    return this.documentsService.findAll(user, paginationDto);
  }

  @Get('type/:type')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get documents by type' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  findByType(@Param('type') type: string, @CurrentUser() user: RequestUser) {
    return this.documentsService.findByType(type, user);
  }

  @Get('category/:category')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get documents by category' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  findByCategory(@Param('category') category: string, @CurrentUser() user: RequestUser) {
    return this.documentsService.findByCategory(category, user);
  }

  @Get('building/:buildingId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get documents by building' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  findByBuilding(@Param('buildingId', ParseUUIDPipe) buildingId: string, @CurrentUser() user: RequestUser) {
    return this.documentsService.findByBuilding(buildingId, user);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.documentsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.documentsService.update(id, updateDocumentDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.documentsService.remove(id, user);
  }
}
