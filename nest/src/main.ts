import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import PassportIoAdapter from './passport.adapter';

export const domainName = 'localhost:8080';

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function checkEnvVariables(configService: ConfigService) {
  const envVariables = [
    'DOMAIN_NAME',
    'NODE_ENV',
    'POSTGRES_DB',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_PORT',
    'DATABASE_URL',
    'SESSION_SECRET',
    'COOKIE_MAX_AGE',
    'FT_CLIENT_ID',
    'FT_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ];

  for (let index = 0; index < envVariables.length; index++) {
    const varName = envVariables[index];
    if (configService.get<string>(varName).length === 0)
      console.log(`WARNING ENV: '${varName}' is undefined`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  checkEnvVariables(configService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const sessionMiddleware = session({
    secret: configService.get<string>('SESSION_SECRET'),
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: parseInt(configService.get<string>('COOKIE_MAX_AGE')),
    },
  });
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('pong')
    .setDescription('Game of Pong')
    .setVersion('0.1')
    .addBearerAuth()
    .addServer('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const passportIoAdapter = new PassportIoAdapter(app, sessionMiddleware);
  app.useWebSocketAdapter(passportIoAdapter);

  await app.listen(3000);
}
bootstrap();
