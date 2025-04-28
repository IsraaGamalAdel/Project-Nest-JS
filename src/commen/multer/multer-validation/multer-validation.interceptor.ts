import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, Optional, Options } from '@nestjs/common';
import { Observable } from 'rxjs';


@Injectable()
export class MulterValidationInterceptor implements NestInterceptor {

  // constructor ( @Optional() public readonly checkRequired: boolean = true) {}
  // constructor ( public readonly minKey: string = 'file') {}


  public mainKey: string;
  constructor (@Optional()  mainKey?: string) {
    this.mainKey = mainKey || 'file';
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // if(this.checkRequired) {
      if(
        !req.file && 
        (
            !req.files || !Object.values(req.files).length || !req.files[`${this.mainKey}`]?.length
        ) 
      ) {
        throw new BadRequestException('file or files is required');
      }
    // }
    return next.handle();
  }
}