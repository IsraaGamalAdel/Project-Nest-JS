import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { generateHash } from "src/commen/security/hash.security";
import * as bcrypt from "bcrypt";



export enum GenderTypes {
    male = 'male',
    female = 'female'
}

export enum RoleTypes {
    user = 'user',
    admin = 'admin',
    superAdmin = 'superAdmin'
}


@Schema({
    timestamps: true , 
    toObject: {virtuals: true} , 
    toJSON: {virtuals: true}
})
export class User {

    @Virtual({ 
        get: function (this: User) {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value: string) {
            const [firstName, lastName] = value.split(' ');
            this.firstName = firstName;
            this.lastName = lastName;
        }
    })
    userName: string;

    @Prop({required: true , minlength:2 , maxlength: 50 ,trim: true})
    firstName: string;

    @Prop({required: true , minlength:2 , maxlength: 50 ,trim: true})
    lastName: string;

    @Prop({required:true ,unique: true })
    email: string;

    @Prop({type: Date})
    confirmEmail: Date

    @Prop({required: true})
    password: string

    @Prop()
    address: string

    @Prop()
    phone: string

    @Prop({required: true , enum: GenderTypes , default: GenderTypes.female})
    gender: GenderTypes

    @Prop({required: true , enum: RoleTypes , default: RoleTypes.user})
    role: RoleTypes

    @Prop()
    otp: string

    @Prop({type: Date})
    changeCredentialTime: Date
}

// return document type contain document & User
export type UserDocument = HydratedDocument<User>;

// convert class to mongoose schema
export const UserSchema = SchemaFactory.createForClass(User);


// UserSchema.pre('save' , function(next) {
//     if(this.isModified('password')){
//         this.password = generateHash(this.password);
//     }
//     return next();
// })


// export const UserModule = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])


// Hooks (middleware)
export const UserModule = MongooseModule.forFeatureAsync([
    {
        name: User.name,
        useFactory: () => {
            UserSchema.pre('save' , function(next) {
                if(this.isModified('password')){
                    this.password = generateHash(this.password);
                }
                
                if(this.isModified('otp')){
                    this.otp = generateHash(this.otp);
                }
                return next();
            });

            // لتاكيد 
            UserSchema.methods.comparePassword  = async function(plainPassword: string){
                return await bcrypt.compare(plainPassword , this.password)
            }

            return UserSchema
        }
    }
])


export const connectedUsers = new Map();


