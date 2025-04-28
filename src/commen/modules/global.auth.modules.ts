import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "src/DB/model/User.model";
import { UserRepositoryService } from "src/DB/repository/User.repository.service";
import { TokenService } from "../service/token.service";




@Global()
@Module({
    imports:[UserModule],
    providers: [  UserRepositoryService , JwtService , TokenService],
        
    exports: [UserModule ,UserRepositoryService , JwtService , TokenService]
})

export class GlobalAuthModule {}