import { PartialType } from '@nestjs/swagger';
import { CreateVendorAvailabilityDto } from './create-vendor-availability.dto';

export class UpdateVendorAvailabilityDto extends PartialType(
  CreateVendorAvailabilityDto,
) {}
