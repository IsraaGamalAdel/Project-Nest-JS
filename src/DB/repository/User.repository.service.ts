import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../model/User.model";
import { FilterQuery, Model, PopulateOptions } from "mongoose";
import { DatabaseRepository } from "./db.repository";



@Injectable()
export class UserRepositoryService extends DatabaseRepository<UserDocument> {
    constructor (
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {
        super(userModel)
    }

    async checkDuplicateAccount(data: FilterQuery<UserDocument>): Promise<null> {
        const checkUser = await this.findOne({
            filter: data ,
        })
        if(checkUser){
            throw new ConflictException('user already exist')
        }
        return null;
    }
}