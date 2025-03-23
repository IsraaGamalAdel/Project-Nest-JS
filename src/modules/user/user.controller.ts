import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/commen/decorators/user.decorators';
import { AuthenticationGuard } from 'src/commen/guard/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/commen/guard/authorization/authorization.guard';
import { Roles } from 'src/commen/decorators/roles.decorators';
import { Auth } from 'src/commen/decorators/auth.decorators';



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
    profile( @User() user: UserDocument){
        return this.userService.profile(user);
    }
}

