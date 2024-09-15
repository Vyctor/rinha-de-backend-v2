import {
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(1)
  @IsInt()
  valor: number;

  @IsEnum(['c', 'd'])
  tipo: string;

  @IsString()
  @Length(1, 10)
  descricao: string;
}
