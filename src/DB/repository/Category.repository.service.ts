import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DatabaseRepository } from "./db.repository";
import { Category, CategoryDocument } from "../model/Category.model";



@Injectable()
export class CategoryRepositoryService<TDocument> extends DatabaseRepository<TDocument> {
    constructor (
        @InjectModel(Category.name)  readonly categoryModel: Model<TDocument>
    ) {
        super(categoryModel)
    }

    async checkDuplicateCategory(data: FilterQuery<TDocument>): Promise<null> {
        const checkCategory = await this.findOne({
            filter: data ,
        })
        if(checkCategory){
            throw new ConflictException('category already exist')
        }
        return null;
    }

}


// @Injectable()
// export class CategoryRepositoryService extends DatabaseRepository<CategoryDocument> {
//     constructor (
//         @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
//     ) {
//         super(categoryModel)
//     }

//     async checkDuplicateCategory(data: FilterQuery<CategoryDocument>): Promise<null> {
//         const checkCategory = await this.findOne({
//             filter: data ,
//         })
//         if(checkCategory){
//             throw new ConflictException('category already exist ')
//         }
//         return null;
//     }

// }
// //Not private