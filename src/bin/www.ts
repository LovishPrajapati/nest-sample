import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastify from 'fastify';
import { db } from './db';
import { AppModule } from '../app/app.module';
import { MONGO_URI, PORT } from '../config/keys';
import { logger } from '../utils/fns/logger';

// Creating fastify instance, So we can test api if needed
const server = fastify({
  logger,
  disableRequestLogging: true,
  trustProxy: true,
})
  // This hook is added only for logging as default logger of fastify logs request/reply seperately
  // This hook logs both request/reply in a single log message
  // Also, uses different logger for success and error by looking at statusCode
  .addHook('onResponse', (req, res, done) => {
    const { statusCode = 500 } = res;

    if (statusCode >= 400) {
      logger.error({ req, res }, res.raw.statusMessage);
    } else {
      logger.info({ req, res }, 'Success');
    }

    done();
  });

async function bootstrap() {
  // App Startup with Nestify as underlying Framework
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(server),
    {
      // This is the nest logger
      logger: ['warn', 'error', 'debug'],
    },
  );

  app
    .useGlobalPipes(
      new ValidationPipe({
        // Disabling auto transforming of json payload
        // If you want to convert type, use class-transformer
        transform: false,
        // For not allowing any unexpected payload
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    .setGlobalPrefix('/api');

  // db connection establish
  await db(MONGO_URI);

  logger.info('[MONGODB]::Connected');

  await app.listen(Number(PORT), '::');
}

bootstrap().catch((error) => {
  throw error;
});
