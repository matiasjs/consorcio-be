import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssistantGuard } from '../../../common/guards/assistant.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { EntityCatalog } from '../interfaces/entity-catalog.interface';
import { EntityCatalogService } from '../services/entity-catalog.service';

@ApiTags('Assistant')
@Controller({ path: 'assistant/catalog', version: '1' })
@UseGuards(JwtAuthGuard, AssistantGuard)
@ApiBearerAuth()
export class EntityCatalogController {
  constructor(private readonly entityCatalogService: EntityCatalogService) { }

  @Get()
  @ApiOperation({
    summary: 'Get entity catalog',
    description: 'Returns the complete catalog of entities, fields, types, validations and relationships for the assistant'
  })
  @ApiResponse({
    status: 200,
    description: 'Entity catalog retrieved successfully',
    type: Object // We'll define a proper DTO later if needed
  })
  @ApiResponse({
    status: 403,
    description: 'Assistant feature is disabled or insufficient permissions'
  })
  async getCatalog(): Promise<EntityCatalog> {
    return this.entityCatalogService.generateCatalog();
  }
}
