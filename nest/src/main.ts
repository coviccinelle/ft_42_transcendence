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

export interface LimitsObject {
  [x: string]: number
}

export const limits: LimitsObject = {
  nickname: 15,
  password: 64,
}

export interface ReportErrors {
  errorCode: number,
  message: string,
  other?: any,
};

export const errors: ReportErrors[] = [
  { errorCode: 0, message: "Unknown error." },
  { errorCode: 1, message: "User not found." },
  { errorCode: 2, message: "User do not need 2FA." },
  { errorCode: 3, message: "Email is invalid." },
  { errorCode: 4, message: "Email is already registred." },
  { errorCode: 5, message: String("Password should be " + limits.password.toString() + " characters max.") },
  { errorCode: 6, message: "Password is invalid." },
  { errorCode: 7, message: "2FA code is invalid." },
  { errorCode: 8, message: String("Nickname should be " + limits.password.toString() + " characters max.") },
];

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
      maxAge: 86400000,
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
