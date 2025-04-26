import { Module } from "@nestjs/common";
import { RealTimeGateway } from "./gateway";
import { TokenService } from "src/commen/service/token.service";


@Module({
    providers: [
        RealTimeGateway , TokenService
    ],
})


export class GatewayModule {}