import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/DB/model/User.model';


// return user فقط  
// دة بدل منا بجيب res.user كامل NestJS وفرتها 

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) : UserDocument => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

