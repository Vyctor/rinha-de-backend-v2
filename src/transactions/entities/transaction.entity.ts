import { Client } from 'src/clients/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column({
    enum: ['c', 'd'],
  })
  type: string;

  @Column({
    length: 100,
  })
  description: string;

  @ManyToOne(() => Client)
  @JoinColumn({
    name: 'client_id',
  })
  client: Client;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
