import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Headers,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { AssistantGuard, AssistantApplyGuard } from '../../../common/guards/assistant.guard';
import { ToolExecutionService } from '../services/tool-execution.service';
import { ToolExecutionDto, ToolResultDto } from '../dto/tool-call.dto';

@ApiTags('Assistant')
@Controller('assistant/tool')
@UseGuards(JwtAuthGuard, AssistantGuard)
@ApiBearerAuth()
export class ToolExecutionController {
  constructor(private readonly toolExecutionService: ToolExecutionService) {}

  @Post('execute')
  @UseGuards(AssistantApplyGuard)
  @ApiOperation({ 
    summary: 'Execute a tool call',
    description: 'Executes a tool call against the domain layer. Supports dry-run and apply modes with idempotency.'
  })
  @ApiHeader({
    name: 'x-idempotency-key',
    description: 'Idempotency key to prevent duplicate operations',
    required: false,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tool executed successfully',
    type: ToolResultDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid tool call or parameters' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Insufficient permissions for apply mode' 
  })
  async executeTool(
    @Body() toolExecution: ToolExecutionDto,
    @Headers('x-idempotency-key') idempotencyKey?: string,
    @Request() req?: any
  ): Promise<ToolResultDto> {
    const userContext = {
      userId: req.user?.id,
      adminId: req.user?.adminId,
      roles: req.user?.roles || [],
    };

    return this.toolExecutionService.executeToolCall(
      toolExecution.toolCall,
      toolExecution.mode,
      idempotencyKey || toolExecution.idempotencyKey,
      userContext
    );
  }
}
