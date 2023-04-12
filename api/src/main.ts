import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup cofig api-docs
  const config = new DocumentBuilder()
    .setTitle('XepHang API')
    .setDescription('The waiting queue API description')
    .setVersion('1.0')
    .addSecurity('bearerAuth', {
      name: 'Authorization',
      type: 'apiKey',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 5000, () => {
    console.log(`Our server is listening on PORT: ${process.env.PORT || 5000}`);
  });
}
bootstrap();
