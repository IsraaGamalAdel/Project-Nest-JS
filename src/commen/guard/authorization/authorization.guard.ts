import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { log } from 'console';
import { Observable } from 'rxjs';
import { Roles, rolesKey } from 'src/commen/decorators/roles.decorators';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';



@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor (
    private reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // const user = context.switchToHttp().getRequest().user;

    const requiredRoles = this.reflector.getAllAndOverride<RoleTypes[]>(
      rolesKey, 
      [
        context.getHandler(),
        context.getClass(),
      ]
    );

    // log({
    //   requiredRoles,
    //   method: context.getHandler(),
    //   class: context.getClass(),
    // })


    let user: UserDocument | undefined;

    switch(context['contextType']) {
          case 'http':
            user = context.switchToHttp().getRequest().user 
            break;
          case 'ws':
            user = context.switchToWs().getClient().user 
            break;
          case 'graphql':
              user = GqlExecutionContext.create(context).getContext().req.user
          
              log(user)
              break;
          default:
            break;
        }

    if (!user || !requiredRoles.includes(user.role)) {
      // throw new ForbiddenException('Not Authorized to access');
      return false;
    }

    return true;
  }
}
