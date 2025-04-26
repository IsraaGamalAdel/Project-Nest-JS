import { OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { log } from "console";
import { Server, Socket } from "socket.io";
import { TokenService } from "src/commen/service/token.service";
import { connectedUsers, RoleTypes, UserDocument } from "src/DB/model/User.model";
import { AuthenticationGuard } from 'src/commen/guard/authentication/authentication.guard';
import { Auth } from "src/commen/decorators/auth.decorators";
import { Types } from "mongoose";



export interface IAuthSocket  extends Socket{
    user: UserDocument
};


@WebSocketGateway( {
    cors: {
        origin: '*'
    },
    namespace: '/chat'
})

//OnModuleInit => when the module is initialized , start the server 
// export class RealTimeGateway implements OnModuleInit {
export class RealTimeGateway implements OnGatewayInit , OnGatewayConnection , OnGatewayDisconnect {

    @WebSocketServer()
    private server: Server;

    constructor(
        private readonly tokenService: TokenService
    ){}

    // onModuleInit(){
    //     log('server is running')
    //     this.server.on('connection', (socket) => {
    //         log(' client connected ' , socket.id);

    //         socket.on('disconnect' , () => {
    //             log(' client disconnected ' , socket.id)
    //         })
    //     })
    // }

    afterInit(server: Server) {
        log('server is running')
    };


    destructAuthorization(client: Socket) : string{
        return client.handshake.headers?.authorization || client.handshake.auth?.authorization
    };

    async handleConnection(client: Socket, ...args: any[]) : Promise<void> {
        try {
            log(' client connected ' , client.id);
            const authorization = this.destructAuthorization(client);
            log({authorization});

            const user = await this.tokenService.verify({authorization});
            log('user' , user);

            client['user'] = user;
            connectedUsers.set(user._id , client.id);
            log('connectedUsersConnect' , connectedUsers);
        } catch (error) {
            client.emit('exception' , error.message || 'fall in handleConnection');
        }
    };

    handleDisconnect(client: IAuthSocket) {
        log({clientUser: client['user']});
        connectedUsers.delete(client['user']._id);
        log('connectedUsersDisconnect' , connectedUsers);
        log(' client disconnected ' , client.id) 
    };


    // @UseGuards(AuthenticationGuard)
    @Auth([RoleTypes.user])
    
    @SubscribeMessage('hiSocketIo')
    hiSocketIo (
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket
    ) : void {
        try{
            // log({body});
            // log({client});

            // client.emit('hiSocketIoEmit', 'hi nest postman')// send to client only

            // this.server.emit('hiSocketIo', 'hi Huda') // send to all client

            // client.broadcast.emit('hiSocketIo', 'hi Huda') // send to all client except client
            client.emit('hiSocketIo', 'hi Huda') // send to all client except client
        } catch (error) {
            client.emit('exception' , error.message || 'fall Auth');
        }
    }


    emitChangesProductStock (
        data: {
            productId: Types.ObjectId ,
            stock: number
        } | {
            productId: Types.ObjectId ,
            stock: number
        } []
    ) : void {
        try{
            this.server.emit('emitChangesProductStock', data) // send to all client except client
        } catch (error) {
            this.server.emit('exception' , error.message || 'fall Auth');
        }
    }
}