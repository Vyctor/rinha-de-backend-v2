import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('clientes')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post(':id/transacoes')
  async create(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create({
      clientId: id,
      value: createTransactionDto.valor,
      type: createTransactionDto.tipo,
      description: createTransactionDto.descricao,
    });
  }

  @Get(':id/extrato')
  async getTransactions(@Param('id', new ParseIntPipe()) id: number) {
    return await this.transactionsService.getTransactions(id);
  }
}
