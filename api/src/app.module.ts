import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './exception/exception.filter';
import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
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
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MailModule } from './mail/mail.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('FILE_PATH'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
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
    MailModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    AppService,
  ],
})
export class AppModule {}
