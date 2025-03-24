import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, ObjectId, Types } from "mongoose";
import { ICategory } from "src/modules/category/category.interface";


@Schema({
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})


export class Category extends Document implements ICategory {
    @Prop({ type: Types.ObjectId })
    _id: ObjectId

    @Prop({ required: true , minlength: 2 , maxlength: 50 , trim: true })
    name: string

    @Prop({ required: true , minlength: 2 , maxlength: 50 , trim: true })
    slug: string

    @Prop({ required: true })
    logo: string

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User'
    })
    createdBy: ObjectId
}

export type CategoryDocument = HydratedDocument<Category>


export const CategorySchema = SchemaFactory.createForClass(Category);


export const CategoryModule = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])