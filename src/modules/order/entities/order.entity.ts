import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IOrder, IOrderProduct, OrderStatus, PaymentMethod } from "../order.interface";
import { Types } from "mongoose";
import { OneProductResponse } from "src/modules/product/entities/product.entities";
import { IUser } from "src/modules/user/user.interface";
import { OneUserResponse } from "src/modules/user/entities/user.entities";
// import { IOrder } from 'src/modules/order/order.interface';
import { IProduct } from "src/modules/product/product.interface";



registerEnumType(PaymentMethod , 
    { name: 'PaymentMethod', }
);
registerEnumType(OrderStatus , 
    { name: 'OrderStatus', }
);

@ObjectType()
export class IOrderProductResponse implements IOrderProduct{
    
    @Field(()=> ID)
    _id?: Types.ObjectId;

    @Field( ()=> String )
    name: string;

    @Field( ()=> OneProductResponse )
    productId: IProduct;

    @Field( ()=> Number )
    quantity: number;

    @Field( ()=> Number )
    unitPrice: number;

    @Field( ()=> Number , {nullable: false})
    finalPrice: number;
}



@ObjectType()
export class OneOrderResponse implements IOrder {

    @Field(()=> ID)
    _id?: Types.ObjectId;

    @Field( ()=> String )
    address: string;

    @Field( ()=> String , {nullable: true})
    note?: string ;

    @Field( ()=> Date )
    createdAt?: Date;

    @Field(()=> OneUserResponse) //type GraphQL
    createdBy: IUser;  // type TS

    @Field( ()=> Number , {nullable: true})
    discountAmount?: number | undefined;

    @Field( ()=> Number , {nullable: false})
    finalPrice: number;

    @Field( ()=> String , {nullable: true})
    intentId?: string;

    @Field( ()=> String , {nullable: false})
    orderId: string;

    @Field( ()=> Date , {nullable: true})
    paidAt?: Date;

    @Field( ()=> PaymentMethod )
    paymentMethod: PaymentMethod

    @Field( ()=> String , {nullable: false})
    phone: string;

    @Field( ()=> [IOrderProductResponse] , {nullable: false})
    products: IOrderProduct[];

    @Field( ()=> String , {nullable: true})
    rejectedReason?: string;

    @Field( ()=> OrderStatus)
    status: OrderStatus;

    @Field( ()=> Number , {nullable: false})
    subTotal: number;

    @Field( ()=> Date , {nullable: true})
    updatedAt?: Date;

    @Field( () => ID , {nullable: true})
    updatedBy?: Types.ObjectId;


    // refundAmount?: number;
    // refundDate?: Date;
}
