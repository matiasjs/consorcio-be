import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../../../common/decorators';
import { AssistantGuard } from '../../../common/guards/assistant.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { AssistantRequestDto, AssistantResponseDto } from '../dto/assistant.dto';
import { AssistantService } from '../services/assistant.service';

@ApiTags('Assistant')
@Controller({ path: 'assistant', version: '1' })
@UseGuards(JwtAuthGuard, AssistantGuard)
@ApiBearerAuth()
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) { }

  @Post()
  @ApiOperation({
    summary: 'Process assistant message',
    description: 'Processes a message with the AI assistant. Returns proposals without executing them.'
  })
  @ApiResponse({
    status: 200,
    description: 'Message processed successfully',
    type: AssistantResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Assistant feature is disabled'
  })
  async processMessage(
    @Body() request: AssistantRequestDto,
    @Request() req: any,
    @Headers() headers: any
  ): Promise<AssistantResponseDto> {
    const userContext = {
      userId: req.user?.id,
      adminId: req.user?.adminId,
      roles: req.user?.roles || [],
      ipAddress: req.ip,
      userAgent: headers['user-agent'],
    };

    try {
      return await this.assistantService.processMessage(request, userContext);
    } catch (error) {
      // Return a user-friendly error response instead of throwing
      return {
        message: `Lo siento, ocurrió un error al procesar tu mensaje: ${error.message}. Por favor verifica tu consulta e intenta nuevamente.`,
        toolCalls: [],
        timestamp: new Date().toISOString(),
        finished: true,
        usage: undefined,
        error: true
      } as any;
    }
  }

  @Post('stream')
  @ApiOperation({
    summary: 'Stream assistant message',
    description: 'Streams a response from the AI assistant using Server-Sent Events (SSE)'
  })
  @ApiResponse({
    status: 200,
    description: 'Streaming response started',
    headers: {
      'Content-Type': { description: 'text/event-stream' },
      'Cache-Control': { description: 'no-cache' },
      'Connection': { description: 'keep-alive' },
    }
  })
  async streamMessage(
    @Body() request: AssistantRequestDto,
    @Request() req: any,
    @Headers() headers: any,
    @Res() res: Response
  ): Promise<void> {
    const userContext = {
      userId: req.user?.id,
      adminId: req.user?.adminId,
      roles: req.user?.roles || [],
      ipAddress: req.ip,
      userAgent: headers['user-agent'],
    };

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    try {
      const stream = await this.assistantService.streamMessage(request, userContext);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          res.write('data: [DONE]\n\n');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            res.write(`${line}\n\n`);
          }
        }
      }
    } catch (error) {
      const errorResponse = {
        error: true,
        message: `Lo siento, ocurrió un error al procesar tu mensaje: ${error.message}. Por favor intenta nuevamente.`,
        timestamp: new Date().toISOString()
      };
      res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
    } finally {
      res.end();
    }
  }

  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Check assistant health',
    description: 'Returns the health status of the assistant and its dependencies'
  })
  @ApiResponse({
    status: 200,
    description: 'Health status retrieved successfully'
  })
  async getHealth(): Promise<any> {
    return { status: 'ok', message: 'Assistant health endpoint working', timestamp: new Date().toISOString() };
  }
}
