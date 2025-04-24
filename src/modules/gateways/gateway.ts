import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { log } from "console";
import { Server } from "socket.io";




@WebSocketGateway( {
    cors: {
        origin: '*'
    }
})


export class RealTimeGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    constructor(){}

    onModuleInit(){
        this.server.on('connection', (socket) => {
            log(socket.id)
        })
    }

    
    @SubscribeMessage('hiSocketIo')
    async hiSocketIo (
        @MessageBody() body: any
    ){
        log({body});

        this.server.emit('hiSocketIo', 'hi Huda')
        return 'done'
    }
}