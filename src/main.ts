import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ErrorValidationTransformer } from './app/transformers/Error.transformer';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // Global prefix REST API
  app.setGlobalPrefix('api');

  // Validate and transform the request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      dismissDefaultMessages: false,
      strictGroups: true,
      exceptionFactory: (errors) => {
        const tranformer = new ErrorValidationTransformer();
        return new UnprocessableEntityException(tranformer.transform(errors));
      },
    }),
  );

  // Transform the response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Security
  app.enableCors();

  // Listeners
  // This can be deleted to run without create a SQS in AWS
  //const sqsExampleConsumer = app.get(ExampleListener);
  //await sqsExampleConsumer.consumer();

  // Documentation
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Boilerplate NestJS MySQL')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Server is running on Port: ${process.env.PORT || 3000}`);
}
bootstrap();
