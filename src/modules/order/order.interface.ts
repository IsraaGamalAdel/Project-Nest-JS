import { Types } from "mongoose";



export enum PaymentMethod{
    cash= 'cash',
    card= 'card'
}


export enum OrderStatus{
    pending = 'pending',
    placed= 'placed',
    onWay= 'on_way',
    delivered= 'delivered',
    canceled= 'canceled'
}


export interface IOrderProduct {
    _id?: Types.ObjectId;
    name: string;
    productId: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    finalPrice: number;
}


export interface IOrderInputs{
    address: string;
    phone: string;

    note?: string;

    paymentMethod: PaymentMethod;

}


export interface IOrder extends IOrderInputs {
    _id?: Types.ObjectId;

    orderId: string;

    intentId?: string;

    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;

    paidAt?: Date;
    rejectedReason?: string;

    refundAmount?: number;
    refundDate?: Date;

    products: IOrderProduct[];

    status: OrderStatus;

    subTotal: number;
    discountAmount?: number;
    finalPrice: number;

    createdAt?: Date;
    updatedAt?: Date;
}