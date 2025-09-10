import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { Unit } from '../../entities/unit.entity';
import { UnitOccupancy } from '../../entities/unit-occupancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unit, UnitOccupancy])],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
