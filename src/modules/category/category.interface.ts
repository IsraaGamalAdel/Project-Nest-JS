import { ObjectId } from "mongoose";





export interface ICategory {
    _d?: ObjectId;

    name: string;

    slug: string;

    logo: string;

    createdBy?: ObjectId;

    createdAt?: Date;

    updatedAt?: Date;
}