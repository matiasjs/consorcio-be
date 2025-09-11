import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber, IsPositive } from 'class-validator';

export class AddMaterialDto {
  @ApiProperty({
    description: 'ID of the material item',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsUUID()
  materialItemId: string;

  @ApiProperty({
    description: 'Quantity of the material needed',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'Unit cost of the material',
    example: 25.5,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitCost: number;
}
