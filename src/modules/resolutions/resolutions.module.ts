import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolutionsService } from './resolutions.service';
import { ResolutionsController } from './resolutions.controller';
import { Resolution } from '../../entities/resolution.entity';
import { Vote } from '../../entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resolution, Vote])],
  controllers: [ResolutionsController],
  providers: [ResolutionsService],
  exports: [ResolutionsService],
})
export class ResolutionsModule {}
