import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Client } from 'src/clients/entities/client.entity';

export type CreateTransactionInput = {
  clientId: number;
  value: number;
  type: string;
  description: string;
};

export type CreateTransactionOutput = {
  limite: number;
  saldo: number;
};

@Injectable()
export class TransactionsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<CreateTransactionOutput> {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(Client, {
        where: {
          id: createTransactionInput.clientId,
        },
      });

      if (!user) {
        throw new NotFoundException('Client not found');
      }

      await manager.insert(
        Transaction,
        manager.create(Transaction, {
          ...createTransactionInput,
          client: {
            id: createTransactionInput.clientId,
          },
        }),
      );

      const transactions = await manager.find(Transaction, {
        where: {
          client: {
            id: createTransactionInput.clientId,
          },
        },
      });

      const balance = transactions.reduce((acc, value) => {
        if (value.type === 'c') {
          return acc + value.value;
        }
        return acc - value.value;
      }, 0);

      if (balance + user.limit < 0) {
        throw new UnprocessableEntityException('Insufficient funds');
      }

      user.balance = balance;
      await manager.save(Client, user);

      return {
        limite: user.limit,
        saldo: user.balance,
      };
    });
  }

  async getTransactions(clientId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(Client, {
        where: {
          id: clientId,
        },
        select: {
          id: true,
          limit: true,
          balance: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Client not found');
      }

      const transactions = await manager.find(Transaction, {
        where: {
          client: user,
        },
        loadRelationIds: true,
        order: {
          createdAt: 'DESC',
        },
        take: 10,
        select: {
          id: true,
          value: true,
          type: true,
          description: true,
          createdAt: true,
        },
      });

      return {
        saldo: {
          total: user.balance,
          limite: user.limit,
          data_extrato: new Date(),
        },
        ultimas_transacoes: transactions.map((t) => ({
          valor: t.value,
          tipo: t.type,
          descricao: t.description,
          realizada_em: t.createdAt,
        })),
      };
    });
  }
}
