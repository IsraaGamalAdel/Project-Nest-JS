import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { GetUserModule } from './modules/user/user.module';
import { GetProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { join, resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { GetCategoryModule } from './modules/category/category.module';
import { GlobalAuthModule } from './commen/modules/global.auth.modules';
import { GetCartModule } from './modules/cart/cart.module';
import { GetOrderModule } from './modules/order/order.module';
import { GatewayModule } from './modules/gateways/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
// import {redisStore} from 'cache-manager-redis-store';
import { createKeyv } from '@keyv/redis';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GetCouponModule } from './modules/coupon/coupon.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URL ?? 'Not connected DB'),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    CacheModule.registerAsync({ // cache to redis
      useFactory: async () => {
          return {
            store: [
              createKeyv('redis://localhost:6379'),
            ]
          }
      },
      isGlobal: true
    }),
    // CacheModule.register({ // cache to memory
    //   isGlobal: true,
    //   ttl: 20000 // delete after 2 seconds
    // }),
    GlobalAuthModule,
    AuthenticationModule ,
    GetUserModule, 
    GetProductModule , 
    GetCategoryModule ,
    GetCartModule,
    GetOrderModule,
    GatewayModule,
    GetCouponModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

console.log('====================================');
console.log({Port : process.env.PORT});
console.log('====================================');
