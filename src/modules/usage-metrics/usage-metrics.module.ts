import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageMetric } from '../../entities/usage-metric.entity';
import { UsageMetricsController } from './usage-metrics.controller';
import { UsageMetricsService } from './usage-metrics.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsageMetric])],
  controllers: [UsageMetricsController],
  providers: [UsageMetricsService],
  exports: [UsageMetricsService],
})
export class UsageMetricsModule {}
