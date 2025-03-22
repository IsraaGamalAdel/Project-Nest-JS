import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true
    }),
    AuthenticationModule , UserModule, ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

console.log('====================================');
console.log({Port : process.env.PORT});
console.log('====================================');
