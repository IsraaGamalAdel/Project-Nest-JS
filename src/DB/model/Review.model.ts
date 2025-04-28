import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UserModule } from "./User.model";
import { ProductModule } from "./Product.model";




@Schema({
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})

export class Review  {

    @Prop({ type: String , required: true })
    comment: string;

    @Prop({type: Types.ObjectId , ref: 'User'})
    createdBy: Types.ObjectId


    @Prop({type: Types.ObjectId , ref: 'Product'})
    productId: Types.ObjectId


    @Prop({ type: Number , min: 0 , max: 5 , required: true })
    rate: number


}

export type ReviewDocument = HydratedDocument<Review>

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const ReviewModule = MongooseModule.forFeatureAsync([
    { 
        name: Review.name, 
        useFactory() {
            return ReviewSchema
        } 
    }
])