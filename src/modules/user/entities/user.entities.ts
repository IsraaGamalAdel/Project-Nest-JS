import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IUser } from "../user.interface";
import { GenderTypes, RoleTypes } from "src/DB/model/User.model";



registerEnumType( GenderTypes , {
    name: 'GenderTypes',
})
registerEnumType( RoleTypes , {
    name: 'RoleTypes',
})


@ObjectType()
export class OneUserResponse implements Partial<IUser>{

    @Field( ()=> String , {nullable: true} )
    userName?: string ;

    @Field( ()=> String )
    firstName: string ;

    @Field( ()=> String )
    lastName: string ;

    @Field( ()=> GenderTypes )
    gender: GenderTypes ;

    @Field( ()=> String )
    password: string ;

    @Field( ()=> String  , {nullable: true} )
    phone?: string ;

    @Field( ()=> String )
    role: RoleTypes ;

    @Field( ()=> Date , {nullable: true} )
    DOB?: Date ;

    @Field( ()=> String , {nullable: true} )
    address?: string ;

    @Field( ()=> Date , {nullable: true} )
    changeCredentialTime?: Date ;

    @Field( ()=> Date , {nullable: true} )
    confirmEmail?: Date ;

    @Field( ()=> String , {nullable: true} )
    otp?: string ;

    @Field( ()=> String , {nullable: false} )
    email: string ;

    @Field( ()=> Date , {nullable: false} )
    createdAt: Date

    @Field( ()=> Date , {nullable: true} )
    updatedAt?: Date
}