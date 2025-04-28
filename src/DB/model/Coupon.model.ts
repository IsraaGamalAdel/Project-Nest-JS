import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UserModule } from "./User.model";




@Schema({
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})

export class Coupon  {

    @Prop({ type: String , required: true })
    code: string;

    @Prop({type: Types.ObjectId , ref: 'User'})
    createdBy: Types.ObjectId

    @Prop({type: Types.ObjectId , ref: 'User'})
    usedBy: Types.ObjectId[]

    @Prop({type: Date , required: true})
    fromDate: Date

    @Prop({type: Date , required: true})
    toDate: Date

    @Prop({type: Number , required: true})
    amount: number

}

export type CouponDocument = HydratedDocument<Coupon>

export const CouponSchema = SchemaFactory.createForClass(Coupon);

export const CouponModule = MongooseModule.forFeatureAsync([
    { 
        name: Coupon.name, 
        useFactory() {
            return CouponSchema
        } 
    }
])