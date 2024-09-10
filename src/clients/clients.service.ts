import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<void> {
    const client = this.clientRepository.create(createClientDto);
    await this.clientRepository.insert(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }
}
