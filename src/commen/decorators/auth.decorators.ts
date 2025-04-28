import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleTypes } from 'src/DB/model/User.model';
import { Roles } from './roles.decorators';
import { AuthenticationGuard } from '../guard/authentication/authentication.guard';
import { AuthorizationGuard } from '../guard/authorization/authorization.guard';



// fn of return () decorator 

export function Auth( roles:RoleTypes[]) {
    return applyDecorators(
        Roles( roles),
        UseGuards(AuthenticationGuard , AuthorizationGuard, )
    )
}
