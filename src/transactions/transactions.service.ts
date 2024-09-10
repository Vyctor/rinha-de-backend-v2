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
    try {
      return await this.dataSource.transaction(async (manager) => {
        const client = await manager.findOne(Client, {
          where: {
            id: createTransactionInput.clientId,
          },
        });

        if (!client) {
          throw new NotFoundException('Client not found');
        }

        if (createTransactionInput.type === 'c') {
          client.balance += createTransactionInput.value;
        } else {
          client.balance -= createTransactionInput.value;
        }

        if (client.balance + client.limit < 0) {
          throw new UnprocessableEntityException('Insufficient funds');
        }

        await Promise.all([
          await manager.update(Client, client.id, {
            balance: client.balance,
          }),
          await manager.insert(
            Transaction,
            manager.create(Transaction, {
              ...createTransactionInput,
              client: {
                id: createTransactionInput.clientId,
              },
            }),
          ),
        ]);

        return {
          limite: client.limit,
          saldo: client.balance,
        };
      });
    } catch (e) {
      throw e;
    }
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
