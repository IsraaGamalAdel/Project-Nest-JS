import { Types } from "mongoose";
import { IAttachment } from "src/commen/multer/cloud.service";
import { IUser } from "../user/user.interface";


export enum ProductSize {
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl',
    xxl = 'xxl'
}


export interface IProductInputs {

    name: string;
    description: string;

    stock: number;
    originalPrice: number;
    discountPercent?: number;

    colors?: string[];
    size? : ProductSize[];

    categoryId: Types.ObjectId;
}


export interface IProduct extends IProductInputs{
    _id?: Types.ObjectId;

    slug: string;

    finalPrice: number;

    folderId: string;
    image: IAttachment;
    gallery?: IAttachment[];

    createdBy: Types.ObjectId | IUser;

    createdAt?: Date;
    updatedAt?: Date
}