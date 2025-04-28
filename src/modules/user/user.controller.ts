import { Controller, Get, Headers, Req, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/commen/decorators/user.decorators';
import { AuthenticationGuard } from 'src/commen/guard/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/commen/guard/authorization/authorization.guard';
import { Roles } from 'src/commen/decorators/roles.decorators';
import { Auth } from 'src/commen/decorators/auth.decorators';
import { log } from 'console';
import { WatchRequestInterceptor } from 'src/commen/interceptors/watchReq.interceptors';



@UseInterceptors(WatchRequestInterceptor)

@Controller('user/')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Roles( [RoleTypes.user])
    // @UseGuards(AuthenticationGuard , AuthorizationGuard)

    @Auth( [RoleTypes.user])
    
    // profile( @Req() req: IAuthReq): String{
    //     log({controllerUser : req.user})
    //     return this.userService.profile(req.user);
    // }


    @Get('profile')
    // return user from NestJS
    profile( 
        @Headers() header: any,
        @User() user: UserDocument
    ){
        log("header" , header);
        return this.userService.profile(user);
    }
}

