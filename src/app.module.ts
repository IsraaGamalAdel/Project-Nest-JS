import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { GetUserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URL ?? 'Not connected DB'),
    AuthenticationModule , GetUserModule, ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

console.log('====================================');
console.log({Port : process.env.PORT});
console.log('====================================');
