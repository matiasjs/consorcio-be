import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Weekday {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export class CreateVendorAvailabilityDto {
  @ApiProperty({ example: 'monday', enum: Weekday })
  @IsEnum(Weekday)
  weekday: Weekday;

  @ApiProperty({ example: '09:00' })
  @IsString()
  from: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  to: string;
}
