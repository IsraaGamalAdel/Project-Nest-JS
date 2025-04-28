import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DatabaseRepository } from "./db.repository";
import { Review, ReviewDocument } from "../model/Review.model";





@Injectable()
export class ReviewRepositoryService<TDocument> extends DatabaseRepository<TDocument> {
    constructor (
        @InjectModel(Review.name) readonly ReviewModel: Model<TDocument>
    ) {
        super(ReviewModel)
    }

    
    async checkDuplicateReview(data: FilterQuery<TDocument>): Promise<null> {
        const checkReview = await this.findOne({
            filter: data ,
        })
        if(checkReview){
            throw new ConflictException(' Review already exist ')
        }
        return null;
    }

}


// export class ReviewRepository extends DatabaseRepository<ReviewDocument> {
//     constructor (
//         @InjectModel(Review.name) readonly ReviewModel: Model<ReviewDocument>
//     ) {
//         super(ReviewModel)
//     }

// }