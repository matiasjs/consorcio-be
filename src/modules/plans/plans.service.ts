import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenancePlan } from '../../entities/maintenance-plan.entity';
import { MaintenanceTask } from '../../entities/maintenance-task.entity';
import { CreateMaintenanceTaskDto } from './dto';
import { RequestUser } from '../../common/interfaces';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(MaintenancePlan)
    private readonly planRepository: Repository<MaintenancePlan>,
    @InjectRepository(MaintenanceTask)
    private readonly taskRepository: Repository<MaintenanceTask>,
  ) {}

  async findPlan(id: string, user: RequestUser): Promise<MaintenancePlan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['asset'],
    });

    if (!plan) {
      throw new NotFoundException(`Maintenance plan with ID ${id} not found`);
    }

    // Check if user has access to this plan through their admin
    if (plan.asset.adminId !== user.adminId) {
      throw new NotFoundException(`Maintenance plan with ID ${id} not found`);
    }

    return plan;
  }

  async getTasks(planId: string, user: RequestUser): Promise<MaintenanceTask[]> {
    const plan = await this.findPlan(planId, user);
    
    return await this.taskRepository.find({
      where: { planId },
      order: { scheduledDate: 'ASC' },
    });
  }

  async createTask(planId: string, createTaskDto: CreateMaintenanceTaskDto, user: RequestUser): Promise<MaintenanceTask> {
    const plan = await this.findPlan(planId, user);
    
    const task = this.taskRepository.create({
      ...createTaskDto,
      planId,
      scheduledDate: new Date(createTaskDto.scheduledDate),
    });

    return await this.taskRepository.save(task);
  }
}
