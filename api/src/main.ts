import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

/**
 * Bootstrap function for nestjs application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new LoggerService(),
    autoFlushLogs: true,
    bufferLogs: true,
  });

  // setup cofig api-docs
  const config = new DocumentBuilder()
    .setTitle('XepHang API')
    .setDescription('The waiting queue API description')
    .setVersion('1.0')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     in: 'cookie',
    //     description: 'Enter your JWT token',
    //   },
    //   'jwt',
    // )
    // .addSecurityRequirements('jwt')
    .build();
  // setup api-docs route
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    yamlDocumentUrl: '/api.yaml',
    jsonDocumentUrl: '/api.json',
  });

  // setup global validation pipe for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,

      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: true,
    }),
  );

  // setup cookie parser for all routes
  app.use(cookieParser());
  // start server
  await app.listen(process.env.PORT || 5000, () => {
    console.log(`Our server is listening on PORT: ${process.env.PORT || 5000}`);
  });
}
bootstrap();
