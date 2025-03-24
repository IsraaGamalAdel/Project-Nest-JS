import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenService } from 'src/commen/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryService } from 'src/DB/repository/User.repository.service';
import { UserModule } from 'src/DB/model/User.model';
import { HeaderValidateServiceMiddleware } from 'src/commen/middleware/service/header.validate.service.middleware';



@Module({
  imports: [UserModule],
  providers: [UserService , TokenService , JwtService , UserRepositoryService],
  controllers: [UserController]
})
export class GetUserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HeaderValidateServiceMiddleware)
      // .forRoutes({ path: 'user/profile', method: RequestMethod.GET });
      
      .forRoutes('user');
  }
}
