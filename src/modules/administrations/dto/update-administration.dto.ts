import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAdministrationDto } from './create-administration.dto';

export class UpdateAdministrationDto extends PartialType(
  OmitType(CreateAdministrationDto, ['cuit'] as const),
) {}
