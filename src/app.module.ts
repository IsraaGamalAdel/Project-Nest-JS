import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { GetUserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { GetCategoryModule } from './modules/category/category.module';
import { GlobalAuthModule } from './commen/modules/global.auth.modules';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URL ?? 'Not connected DB'),
    GlobalAuthModule,
    AuthenticationModule , 
    GetUserModule, 
    ProductModule , 
    GetCategoryModule , 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

console.log('====================================');
console.log({Port : process.env.PORT});
console.log('====================================');
