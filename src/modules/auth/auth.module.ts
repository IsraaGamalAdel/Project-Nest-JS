import { Module } from "@nestjs/common";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";
import { UserModule } from "src/DB/model/User.model";
import { UserRepositoryService } from "src/DB/repository/User.repository.service";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/commen/service/token.service";



@Module({
    imports:[UserModule],
    controllers: [AuthenticationController],
    providers: [AuthenticationService , UserRepositoryService , JwtService , TokenService],
    
    exports: [UserModule ,UserRepositoryService , JwtService , TokenService]
})

export class AuthenticationModule {}