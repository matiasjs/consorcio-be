import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.OWNER,
    UserRole.TENANT,
    UserRole.INSPECTOR,
    UserRole.VENDOR,
  )
  create(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.create(createMessageDto, user.id);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get messages for an entity' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.OWNER,
    UserRole.TENANT,
    UserRole.INSPECTOR,
    UserRole.VENDOR,
  )
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.messagesService.findByEntity(entityType, entityId, page, limit);
  }

  @Get('entity/:entityType/:entityId/unread-count')
  @ApiOperation({ summary: 'Get unread message count for an entity' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.OWNER,
    UserRole.TENANT,
    UserRole.INSPECTOR,
    UserRole.VENDOR,
  )
  getUnreadCount(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseUUIDPipe) entityId: string,
  ) {
    return this.messagesService.getUnreadCount(entityType, entityId);
  }

  @Patch(':id/mark-read')
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.ADMIN_OWNER,
    UserRole.STAFF,
    UserRole.OWNER,
    UserRole.TENANT,
    UserRole.INSPECTOR,
    UserRole.VENDOR,
  )
  markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.markAsRead(id, user.id);
  }
}
