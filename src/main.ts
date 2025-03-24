import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { languageFunctionMiddleware } from './commen/middleware/service/language.function.middleware';
import * as express from 'express'
import { resolve } from 'path';

// import { config } from 'dotenv';
// import {resolve} from 'node:path'
// config({path: resolve('./config/.env.dev') });


async function bootstrap() {
  const port: string | number = process.env.PORT ?? 5000;

  const app = await NestFactory.create(AppModule , { abortOnError: false });  //{ abortOnError: false } returns error message

  app.enableCors({
    origin: '*',
  });

  app.use('/uploads' , express.static(resolve('./uploads')));
  
  //Global to Application
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, 
  //     forbidNonWhitelisted: true ,
  //     stopAtFirstError: false ,     //stopAtFirstError: true (return first error) ,
  //     skipNullProperties: false     //skipNullProperties: true  (return felid null),
      
  //   })
  // )
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Global to Controller Function Language
  app.use(languageFunctionMiddleware);

  await app.listen(port , () => {
    console.log(`Server started on port ${port}`);
  });
}
bootstrap();
