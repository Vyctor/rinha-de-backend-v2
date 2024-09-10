import { IsNumber, Min } from 'class-validator';

export class CreateClientDto {
  @IsNumber()
  @Min(1)
  limit: number;
  @IsNumber()
  @Min(0)
  balance: number;
}
