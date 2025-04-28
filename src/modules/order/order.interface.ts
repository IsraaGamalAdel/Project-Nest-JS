import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IProduct } from "../product/product.interface";



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
    productId: Types.ObjectId | IProduct;
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

    createdBy: Types.ObjectId | IUser;
    updatedBy?: Types.ObjectId | IUser;

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