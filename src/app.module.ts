import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentService } from './config/environment.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        type: environmentService.DB_TYPE as any,
        host: environmentService.DB_URL,
        port: environmentService.DB_PORT,
        database: environmentService.DB_NAME,
        username: environmentService.DB_USER,
        password: environmentService.DB_PASS,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
        pool: {
          max: 200, // Número máximo de conexões
          min: 10, // Número mínimo de conexões
          idleTimeoutMillis: 30000, // Tempo de vida ocioso
        },
      }),
    }),
    ClientsModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
