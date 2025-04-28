import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DatabaseRepository } from "./db.repository";
import { Product, ProductDocument } from "../model/Product.model";
import path from "path";



export const ProductsPopulateList = [
    { path: 'createdBy' },
    // { path: 'categoryId' },
    // { path : 'updatedBy' }
]


@Injectable()
export class ProductRepositoryService<TDocument> extends DatabaseRepository<TDocument> {
    constructor (
        @InjectModel(Product.name) readonly productModel: Model<TDocument>
    ) {
        super(productModel)
    }

    
    async checkDuplicateProduct(data: FilterQuery<TDocument>): Promise<null> {
        const checkProduct = await this.findOne({
            filter: data ,
        })
        if(checkProduct){
            throw new ConflictException('Product already exist ')
        }
        return null;
    }

}