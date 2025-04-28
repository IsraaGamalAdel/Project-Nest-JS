import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserDocument } from 'src/DB/model/User.model';




// return user فقط  
// دة بدل منا بجيب res.user كامل NestJS وفرتها 

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {

        let user: UserDocument;
        switch(ctx['contextType']) {
            case 'http': 
                user = ctx.switchToHttp().getRequest().user;
                break;
            case 'ws': 
                user = ctx.switchToWs().getClient().user;
                break;
            case 'graphql': 
                user = GqlExecutionContext.create(ctx).getContext().req?.user;
                break;
            default:
                throw new Error(`Unknown context type: ${ctx['contextType']}`);
        }

        if (!user) {
            throw new Error('user is not found');
        };

        return user;
    },
);

