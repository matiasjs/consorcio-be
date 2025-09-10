import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resolution } from '../../entities/resolution.entity';
import { Vote } from '../../entities/vote.entity';
import { CreateVoteDto } from './dto';
import { RequestUser } from '../../common/interfaces';

@Injectable()
export class ResolutionsService {
  constructor(
    @InjectRepository(Resolution)
    private readonly resolutionRepository: Repository<Resolution>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async findOne(id: string, user: RequestUser): Promise<Resolution> {
    const resolution = await this.resolutionRepository.findOne({
      where: { id },
      relations: ['meeting', 'votes', 'votes.user'],
    });

    if (!resolution) {
      throw new NotFoundException(`Resolution with ID ${id} not found`);
    }

    // Check if user has access to this resolution through their admin
    if (resolution.meeting.adminId !== user.adminId) {
      throw new NotFoundException(`Resolution with ID ${id} not found`);
    }

    return resolution;
  }

  async createVote(resolutionId: string, createVoteDto: CreateVoteDto, user: RequestUser): Promise<Vote> {
    const resolution = await this.findOne(resolutionId, user);

    // Check if user already voted
    const existingVote = await this.voteRepository.findOne({
      where: { 
        resolutionId,
        userId: createVoteDto.userId,
      },
    });

    if (existingVote) {
      throw new BadRequestException('User has already voted on this resolution');
    }

    const vote = this.voteRepository.create({
      ...createVoteDto,
      resolutionId,
    });

    return await this.voteRepository.save(vote) as any;
  }

  async getVoteResults(resolutionId: string, user: RequestUser): Promise<any> {
    const resolution = await this.findOne(resolutionId, user);

    const results = await this.voteRepository
      .createQueryBuilder('vote')
      .select('vote.vote', 'voteType')
      .addSelect('COUNT(*)', 'count')
      .where('vote.resolutionId = :resolutionId', { resolutionId })
      .groupBy('vote.vote')
      .getRawMany();

    const totalVotes = await this.voteRepository.count({
      where: { resolutionId },
    });

    return {
      resolution,
      results: results.reduce((acc, item) => {
        acc[item.voteType] = parseInt(item.count);
        return acc;
      }, {}),
      totalVotes,
    };
  }
}
