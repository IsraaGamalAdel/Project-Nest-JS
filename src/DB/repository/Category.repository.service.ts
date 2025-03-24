import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DatabaseRepository } from "./db.repository";
import { Category, CategoryDocument } from "../model/Category.model";



@Injectable()
export class CategoryRepositoryService extends DatabaseRepository<CategoryDocument> {
    constructor (
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
    ) {
        super(categoryModel)
    }

}