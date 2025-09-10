import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { Meeting } from '../../entities/meeting.entity';
import { Resolution } from '../../entities/resolution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Resolution])],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
