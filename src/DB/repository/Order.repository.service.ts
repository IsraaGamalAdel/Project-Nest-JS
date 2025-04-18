import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DatabaseRepository } from "./db.repository";
import { Order } from "../model/Order.model";





@Injectable()
export class OrderRepositoryService<TDocument> extends DatabaseRepository<TDocument> {
    constructor (
        @InjectModel(Order.name) readonly OrderModel: Model<TDocument>
    ) {
        super(OrderModel)
    }

}