import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { MessagesModule } from './messages/messages.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { BookingsModule } from './bookings/bookings.module';
import { User } from './users/entities/user.entity';
import { Customer } from './customers/entities/customer.entity';
import { MessageLog } from './messages/entities/message-log.entity';
import { Booking } from './bookings/entities/booking.entity';
import { QuotationsModule } from './quotations/quotations.module';
import { Quotation } from './quotations/entities/quotation.entity';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'assets'),
        serveRoot: '/assets',
      },
      {
        rootPath: join(__dirname, '..', 'uploads'),
        serveRoot: '/uploads',
      }
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', ''),
        database: configService.get('DB_NAME', 'tas_db'),
        entities: [User, Customer, MessageLog, Booking, Quotation],
        synchronize: true, // auto-sync schema in dev
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CustomersModule,
    MessagesModule,
    WhatsappModule,
    BookingsModule,
    QuotationsModule,
  ],
})
export class AppModule {}
