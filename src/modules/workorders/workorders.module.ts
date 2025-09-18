import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrdersService } from './workorders.service';
import { WorkOrdersController } from './workorders.controller';
import { WorkOrder } from '../../entities/work-order.entity';
import { Quote } from '../../entities/quote.entity';
import { ScheduleSlot } from '../../entities/schedule-slot.entity';
import { WorkOrderMaterial } from '../../entities/work-order-material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkOrder,
      Quote,
      ScheduleSlot,
      WorkOrderMaterial,
    ]),
  ],
  controllers: [WorkOrdersController],
  providers: [WorkOrdersService],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
