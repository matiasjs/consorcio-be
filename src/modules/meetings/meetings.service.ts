import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from '../../entities/meeting.entity';
import { Resolution } from '../../entities/resolution.entity';
import { CreateMeetingDto, UpdateMeetingDto, CreateResolutionDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(Resolution)
    private readonly resolutionRepository: Repository<Resolution>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto, user: RequestUser): Promise<Meeting> {
    const meetingData: any = {
      ...createMeetingDto,
      adminId: user.adminId,
      scheduledDate: new Date(createMeetingDto.scheduledDate),
    };

    const meeting = this.meetingRepository.create(meetingData);
    return await this.meetingRepository.save(meeting);
  }

  async findAll(user: RequestUser, paginationDto: PaginationDto): Promise<{
    data: Meeting[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, sortBy = 'scheduledDate', sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.building', 'building')
      .where('meeting.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(meeting.title ILIKE :search OR meeting.description ILIKE :search OR meeting.location ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy(`meeting.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string, user: RequestUser): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: ['building', 'resolutions'],
    });

    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    return meeting;
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto, user: RequestUser): Promise<Meeting> {
    const meeting = await this.findOne(id, user);

    const updateData: any = { ...updateMeetingDto };
    if (updateMeetingDto.scheduledDate) {
      updateData.scheduledDate = new Date(updateMeetingDto.scheduledDate);
    }

    Object.assign(meeting, updateData);
    return await this.meetingRepository.save(meeting);
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const meeting = await this.findOne(id, user);
    await this.meetingRepository.softDelete(id);
  }

  // Resolutions
  async getResolutions(meetingId: string, user: RequestUser): Promise<Resolution[]> {
    const meeting = await this.findOne(meetingId, user);
    return await this.resolutionRepository.find({
      where: { meetingId },
      relations: ['votes'],
      order: { createdAt: 'ASC' },
    });
  }

  async createResolution(meetingId: string, createResolutionDto: CreateResolutionDto, user: RequestUser): Promise<Resolution> {
    const meeting = await this.findOne(meetingId, user);
    
    const resolution = this.resolutionRepository.create({
      ...createResolutionDto,
      meetingId,
    });

    return await this.resolutionRepository.save(resolution);
  }
}
