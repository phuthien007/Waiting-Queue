import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exception/exception.filter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { QueuesModule } from './queues/queues.module';
import { EnrollQueuesModule } from './enroll-queues/enroll-queues.module';
import { User } from './users/entities/user.entity';
import { Tenant } from './tenants/entities/tenants.entity';
import { Queue } from './queues/entities/queue.entity';
import { EnrollQueue } from './enroll-queues/entities/enroll-queue.entity';
import { Event } from './events/entities/event.entity';
import { SessionsModule } from './sessions/sessions.module';
import { Session } from './sessions/entities/session.entity';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { ExceptionModule } from './exception/exception.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.local.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: configService.get<boolean>('DB_SYNC'),
        logging: true,
        logger: 'simple-console',
        // entities
        entities: [User, Tenant, Queue, EnrollQueue, Event, Session],
      }),
    }),
    TenantsModule,
    SessionsModule,
    AuthModule,
    EventsModule,
    QueuesModule,
    EnrollQueuesModule,
    UsersModule,
    LoggerModule,
    ExceptionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
