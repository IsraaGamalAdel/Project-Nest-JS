import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IOrder, IOrderProduct, OrderStatus, PaymentMethod } from "src/modules/order/order.interface";




@Schema({
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})

export class Order  implements IOrder {

    @Prop({ type: String , required: true })
    address: string;

    @Prop({ 
        type: String, 
        default: function (){
            return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
        } 
    })
    orderId: string;

    @Prop({ type: String , required: true })
    phone: string;

    @Prop({ type: String , required: false })
    note?: string;

    @Prop({ type: String , required: false })
    intentId?: string;

    @Prop({ type: String , required: false })
    rejectedReason?: string; // rejectedReason

    @Prop({ type: Date , required: false })
    paidAt?: Date;

    @Prop(
        raw([
            {
                name: {type: String , required: true},
                productId: {type: Types.ObjectId , ref: 'Product' , required: true},
                unitPrice: {type: Number , required: true},
                quantity: {type: Number , required: true},
                finalPrice: {
                    type: Number , required: true 
                    // default: function ( this: IOrderProduct) {
                    //     return this.quantity * this.unitPrice;
                    // }
                },
            }
        ])
    )
    products: IOrderProduct[];

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User',
    })
    createdBy: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
    })
    updatedBy?: Types.ObjectId

    @Prop({ type: Number , required: false })
    discountAmount?: number;

    @Prop({ type: Number , required: false })
    refundAmount?: number;
    @Prop({ type: Date , required: false })
    refundDate?: Date;

    @Prop({ type: Number , required: true })
    subTotal: number;

    @Prop({ type: Number , required: true })
    finalPrice: number;

    @Prop({ type: String  , enum: OrderStatus , default: OrderStatus.pending })
    status: OrderStatus;

    @Prop({ type: String  , enum: PaymentMethod , default: PaymentMethod.cash })
    paymentMethod: PaymentMethod;
}

export type OrderDocument = HydratedDocument<Order>

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModule = MongooseModule.forFeatureAsync([
    { 
        name: Order.name, 
        useFactory() {
            return OrderSchema
        } 
    }
])