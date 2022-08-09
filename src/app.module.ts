import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/common';
import { HealthController } from './app/controllers/health/Health.controller';
import { HealthService } from './app/services/health/health.service';
import { DatabaseModule } from './config/database/database.module';
import { ExampleTransformer } from './app/transformers/Example.tranformer';
import { enviroments } from './config/environments';
import config from './config/config';
import schemaValidation from './config/schema.validation';
import { UserController } from './app/controllers/user/User.controller';
import { UserService } from './app/services/user/User.service';
import { User } from './app/entities/User.entity';
import UserRepository from './app/repositories/User.repository';
import { ErrorValidationTransformer } from './app/transformers/Error.transformer';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'isoDateTime' }),
        winston.format.json(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('My APP'),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          level: 'info',
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new winston.transports.DailyRotateFile({
          level: 'error',
          filename: 'logs/error-application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new winston.transports.Console({ level: 'debug' }),
      ],
      // other options
    }),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: schemaValidation,
    }),
    DatabaseModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20000,
    }),
    TypeOrmModule.forFeature([
      // Example,
      User,
    ]),
    HttpModule,
  ],
  controllers: [
    //ExampleController,
    HealthController,
    UserController,
  ],
  providers: [
    Logger,
    UserRepository,
    UserService,

    //  ExampleService,
    //  ExampleProvider,
    ErrorValidationTransformer,
    ExampleTransformer,
    HealthService,
    // AWSProvider,
    // ExampleListener,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
