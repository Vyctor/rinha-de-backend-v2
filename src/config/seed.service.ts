import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async seedUsers() {
    await this.transactionsRepository.delete({});
    const users = [
      {
        id: 1,
        limite: 100000,
        saldoInicial: 0,
      },
      {
        id: 2,
        limite: 80000,
        saldoInicial: 0,
      },
      {
        id: 3,
        limite: 1000000,
        saldoInicial: 0,
      },
      {
        id: 4,
        limite: 10000000,
        saldoInicial: 0,
      },
      {
        id: 5,
        limite: 500000,
        saldoInicial: 0,
      },
    ];

    for (const user of users) {
      const client = this.clientRepository.create({
        id: user.id,
        limit: user.limite,
        balance: user.saldoInicial,
      });
      await this.clientRepository.save(client);
    }
  }
}
