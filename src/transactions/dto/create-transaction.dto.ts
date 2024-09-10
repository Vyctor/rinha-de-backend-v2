import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(1)
  valor: number;

  @IsEnum(['c', 'd'])
  tipo: string;

  @IsString()
  descricao: string;
}
