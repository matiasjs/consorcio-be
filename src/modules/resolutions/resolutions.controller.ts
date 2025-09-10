import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { JwtAuthGuard, RolesGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
import { CreateVoteDto } from './dto';
import { ResolutionsService } from './resolutions.service';

@ApiTags('Resolutions')
@ApiBearerAuth()
@Controller({ path: 'resolutions', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class ResolutionsController {
  constructor(private readonly resolutionsService: ResolutionsService) { }

  @Post(':id/votes')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Cast vote on resolution' })
  @ApiResponse({ status: 201, description: 'Vote cast successfully' })
  @ApiResponse({ status: 400, description: 'User already voted or bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Resolution not found' })
  createVote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createVoteDto: CreateVoteDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.resolutionsService.createVote(id, createVoteDto, user);
  }

  @Get(':id/results')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER, UserRole.STAFF, UserRole.OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'Get resolution vote results' })
  @ApiResponse({ status: 200, description: 'Vote results retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Resolution not found' })
  getVoteResults(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.resolutionsService.getVoteResults(id, user);
  }
}
