import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
    private readonly TokenService: TokenService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const {authorization} = context.switchToHttp().getRequest().headers;

    log({authorization});

    context.switchToHttp().getRequest().user = await this.TokenService.verify({authorization});

    log({user : context.switchToHttp().getRequest().user});

    return true;
  }
}