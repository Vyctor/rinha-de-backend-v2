import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateClientDto {
  @IsNumber()
  @Min(1)
  @IsInt()
  limit: number;
  @IsNumber()
  @Min(0)
  @IsInt()
  balance: number;
}
