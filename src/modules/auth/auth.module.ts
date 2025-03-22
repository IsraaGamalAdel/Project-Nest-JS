import { Module } from "@nestjs/common";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";

@Module({
    imports:[],
    controllers: [AuthenticationController],
    providers: [AuthenticationService],
    exports: []
})

export class AuthenticationModule {}