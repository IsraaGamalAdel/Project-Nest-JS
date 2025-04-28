import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "./order.service";
import { OneOrderResponse } from "./entities/order.entity";
import { filterOrderDto } from "./dto/update-order.dto";
import { log } from "console";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthenticationGuard } from "src/commen/guard/authentication/authentication.guard";
import { Auth } from "src/commen/decorators/auth.decorators";
import { RoleTypes, UserDocument } from "src/DB/model/User.model";
import { User } from "src/commen/decorators/user.decorators";



@UsePipes( new ValidationPipe({
    whitelist: true
}))


@Resolver()
export class OrderResolver {

    constructor(
        private readonly orderService: OrderService
    ){}

    @Query( () => String , {
        name: 'testQuery' , 
        description: 'test Query'
    })
    sayHi(){
        return 'hi GraphQL';
    }


    @Auth([ RoleTypes.user ])
    @Mutation( () => [OneOrderResponse] , {
        name: 'listOrderOrProduct' ,
    })
    // @Query( () => [OneOrderResponse] , {
    //     name: 'listOrderOrProduct' ,
    // })
    list(
        @User() user: UserDocument,
        @Args('filterOder' , {nullable: true}) filterOrderDto?: filterOrderDto
    ){
        log('user' , user);
        log('filterOrderDto' , filterOrderDto);
        return this.orderService.findAll();
    }
}