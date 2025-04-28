import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { log } from 'console';
import { Observable } from 'rxjs';
import { TokenService } from 'src/commen/service/token.service';
import { UserDocument } from 'src/DB/model/User.model';


export interface IAuthReq extends Request {
  user : UserDocument
}


@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor (
    private readonly tokenService: TokenService
  ){}

  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    log({context});

    let authorization = undefined;
    switch(context['contextType']) {
      case 'http':
        authorization = context.switchToHttp().getRequest().headers.authorization;

        log(authorization);

        if (!authorization) {
          throw new UnauthorizedException('Authorization header is missing');
        }

        context.switchToHttp().getRequest().user = await this.tokenService.verify({authorization});
        break;
      case 'ws':
        authorization = context.switchToWs().getClient().handshake?.auth?.authorization ||
        context.switchToWs().getClient().handshake?.headers?.authorization ;

        log(authorization);

        if (!authorization) {
          throw new UnauthorizedException('Authorization header is missing');
        }

        context.switchToWs().getClient().user = 
          await this.tokenService.verify({authorization});
        break;
      case 'graphql':
        authorization = GqlExecutionContext.create(context).getContext().req.headers?.authorization;

        if (!authorization) {
          throw new UnauthorizedException('Authorization header is missing');
        }

        GqlExecutionContext.create(context).getContext().req.user = 
          await this.tokenService.verify({authorization});

        log(authorization)
        break;
      default:
        break;
    }

    if(!authorization){
      return false;
    }

    return true;
  }
}