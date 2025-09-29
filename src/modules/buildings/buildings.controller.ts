import {
  Body,
  Controller,
  Delete,
  Get,
  Options,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, Permissions, Public } from '../../common/decorators';
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
  @Permissions('manageBuildings')
  @ApiOperation({ summary: 'Get all buildings' })
  @ApiResponse({ status: 200, description: 'Buildings retrieved successfully' })
  findAll(@CurrentUser() currentUser: RequestUser) {
    return this.buildingsService.findAll(currentUser.adminId);
  }

  @Get(':id')
  @Permissions('manageBuildings')
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
    console.log('🏢 BuildingsController.update called:', {
      timestamp: new Date().toISOString(),
      id,
      updateBuildingDto,
      currentUser: currentUser
        ? { id: currentUser.id, adminId: currentUser.adminId }
        : null,
    });
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

  // Manual OPTIONS handler for CORS preflight - COMMENTED OUT FOR GLOBAL HANDLER TEST
  // @Options(':id')
  // @Public()
  // @ApiOperation({ summary: 'Handle CORS preflight for building operations' })
  // handleOptions(@Param('id') id: string, @Res() res: Response) {
  //   console.log(
  //     `🚀 Manual OPTIONS handler called for building: ${id} - ${new Date().toISOString()}`,
  //   );

  //   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  //   res.header(
  //     'Access-Control-Allow-Methods',
  //     'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  //   );
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Content-Type,Authorization,Accept,X-Force-Preflight',
  //   );
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Max-Age', '86400'); // 24 hours

  //   console.log(
  //     `🚀 Manual OPTIONS response sent with CORS headers - ${new Date().toISOString()}`,
  //   );
  //   res.status(204).send();
  // }
}
