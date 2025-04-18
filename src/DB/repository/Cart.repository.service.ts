import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DatabaseRepository } from "./db.repository";
import { Cart } from "../model/Card.model";




@Injectable()
export class CartRepositoryService<TDocument> extends DatabaseRepository<TDocument> {
    constructor (
        @InjectModel(Cart.name) readonly CartModel: Model<TDocument>
    ) {
        super(CartModel)
    }

    
    // async checkDuplicateCart(data: FilterQuery<TDocument>): Promise<null> {
    //     const checkCart = await this.findOne({
    //         filter: data ,
    //     })
    //     if(checkCart){
    //         throw new ConflictException('Cart already exist ')
    //     }
    //     return null;
    // }

}