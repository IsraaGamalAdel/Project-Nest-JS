import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DatabaseRepository } from "./db.repository";
import { Coupon, CouponDocument } from "../model/Coupon.model";





@Injectable()
export class CouponRepositoryService<TDocument> extends DatabaseRepository<TDocument> {
    constructor (
        @InjectModel(Coupon.name) readonly CouponModel: Model<TDocument>
    ) {
        super(CouponModel)
    }

    
    async checkDuplicateCoupon(data: FilterQuery<TDocument>): Promise<null> {
        const checkCoupon = await this.findOne({
            filter: data ,
        })
        if(checkCoupon){
            throw new ConflictException(' Coupon already exist ')
        }
        return null;
    }

}


// export class CouponRepository extends DatabaseRepository<CouponDocument> {
//     constructor (
//         @InjectModel(Coupon.name) readonly CouponModel: Model<CouponDocument>
//     ) {
//         super(CouponModel)
//     }

// }