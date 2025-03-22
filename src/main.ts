import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// import { config } from 'dotenv';
// import {resolve} from 'node:path'
// config({path: resolve('./config/.env.dev') });


async function bootstrap() {
  const port: string | number = process.env.PORT ?? 5000;

  const app = await NestFactory.create(AppModule , { abortOnError: false });  //{ abortOnError: false } returns error message

  
  //Global to Application
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, 
  //     forbidNonWhitelisted: true ,
  //     stopAtFirstError: false ,     //stopAtFirstError: true (return first error) ,
  //     skipNullProperties: false     //skipNullProperties: true  (return felid null),
      
  //   })
  // )
  
  await app.listen(port , () => {
    console.log(`Server started on port ${port}`);
  });
}
bootstrap();
