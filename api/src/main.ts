import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new LoggerService(),
  });

  // setup cofig api-docs
  const config = new DocumentBuilder()
    .setTitle('XepHang API')
    .setDescription('The waiting queue API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addSecurityRequirements('jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    yamlDocumentUrl: '/api.yaml',
  });

  await app.listen(process.env.PORT || 5000, () => {
    console.log(`Our server is listening on PORT: ${process.env.PORT || 5000}`);
  });
}
bootstrap();
