import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ICart, ICartProduct } from './../../modules/cart/cart.interface';



@Schema({
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})

export class Cart  implements ICart {

    @Prop(
        raw([
            {
                productId: {type: Types.ObjectId , required: true , ref: 'Product'},
                quantity: {type: Number , default: 1}
            }
        ])
    )
    products: ICartProduct[];

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User',
        unique: true
    })
    createdBy: Types.ObjectId
}

export type CartDocument = HydratedDocument<Cart>

export const CartSchema = SchemaFactory.createForClass(Cart);

export const CartModule = MongooseModule.forFeatureAsync([
    { 
        name: Cart.name, 
        useFactory() {
            return CartSchema
        } 
    }
])