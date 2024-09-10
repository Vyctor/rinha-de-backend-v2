import { Controller, Post, Body, HttpCode, Get } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clientes')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(204)
  async create(@Body() createClientDto: CreateClientDto) {
    await this.clientsService.create(createClientDto);
  }

  @Get()
  async findAll() {
    return this.clientsService.findAll();
  }
}
