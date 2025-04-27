import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { IProduct, ProductSize } from "../product.interface";
import { IUser } from "src/modules/user/user.interface";
import { OneUserResponse } from "src/modules/user/entities/user.entities";


@ObjectType()
export class OneProductResponse implements Partial<IProduct> {
    @Field(()=> ID)
    _id: Types.ObjectId;

    @Field( ()=> String )
    name: string

    @Field(()=> ID)
    categoryId?: Types.ObjectId ;

    @Field( ()=> String )
    colors?: string[] ;

    @Field( ()=> String )
    createdAt?: Date ;

    @Field( () => OneUserResponse)
    createdBy: IUser ;

    @Field( ()=> String )
    description?: string ;

    @Field( ()=> String )
    discountPercent?: number ;

    @Field( ()=> String )
    finalPrice?: number ;

    @Field( ()=> String )
    folderId?: string ;


    // gallery?: IArguments[] ;
    
    // image: IArguments ;

    @Field( ()=> String )
    originalPrice?: number ;

    @Field( ()=> String )
    size?: ProductSize[] ;

    @Field( ()=> String )
    slug?: string ;

    @Field( ()=> String )
    stock?: number ;

}