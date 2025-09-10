import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Asset } from '../../entities/asset.entity';
import { MaintenancePlan } from '../../entities/maintenance-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, MaintenancePlan])],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
