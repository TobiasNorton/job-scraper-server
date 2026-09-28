import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// This is the entry point for the application, i.e. "Hey Node, start a Nest application using AppModule, and listen for HTTP requests on port 3000."
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap(); // void in this case means I intentionally don't need to await anything here
