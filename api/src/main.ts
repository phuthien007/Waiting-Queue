import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 5000, () => {
    console.log(`Our server is listening on PORT: ${process.env.PORT || 5000}`);
  });
}
bootstrap();
