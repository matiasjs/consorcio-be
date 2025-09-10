import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { MaintenancePlan } from '../../entities/maintenance-plan.entity';
import { MaintenanceTask } from '../../entities/maintenance-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenancePlan, MaintenanceTask])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
