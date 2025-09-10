import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrationsService } from './administrations.service';
import { AdministrationsController } from './administrations.controller';
import { Administration } from '../../entities/administration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Administration])],
  controllers: [AdministrationsController],
  providers: [AdministrationsService],
  exports: [AdministrationsService],
})
export class AdministrationsModule {}
