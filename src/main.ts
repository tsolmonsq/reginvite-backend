import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend URL
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend's URL (adjust if needed)
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description for my NestJS app')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
