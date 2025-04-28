import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { log } from "console";
import { Document, HydratedDocument, ObjectId, Types } from "mongoose";
import slugify from "slugify";
import { IAttachment } from "src/commen/multer/cloud.service";
import { IProduct, ProductSize } from "src/modules/product/product.interface";



@Schema({
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})


export class Product implements IProduct {

    @Prop({ 
        required: true , 
        minlength: 2 , 
        maxlength: 50 , 
        // trim: true ,
    })
    name: string

    @Prop({ 
        required: true , 
        minlength: 2 , 
        maxlength: 50000 , 
    })
    description: string

    @Prop({ 
        required: true , 
        minlength: 2 , 
        maxlength: 75 , 
        default: function ( this: Product) {
            return slugify(this.name ,  {trim: true})
        }
    })
    slug: string;

    @Prop({ required: true , type: Number , default: 1 })
    stock: number;

    @Prop({ required: true , type: Number })
    originalPrice: number;

    @Prop({ required: true , type: Number })
    discountPercent: number;

    @Prop({ required: true , type: Number })
    finalPrice: number;

    @Prop({ required: false , type: Array<String> })
    colors: string[];

    @Prop({ required: false , type: Array<ProductSize> })
    size: ProductSize[];

    @Prop( raw({
        secure_url: {type: String , required: true},
        public_id: {type: String , required: true}
    }))
    image: IAttachment

    @Prop(
        raw([
            {
                secure_url: {type: String , required: true},
                public_id: {type: String , required: true}
            }
        ])
    )
    gallery: IAttachment[];

    @Prop({ required: true })
    folderId: string

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Category'
    })
    categoryId: Types.ObjectId

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User'
    })
    createdBy: Types.ObjectId
}

export type ProductDocument = HydratedDocument<Product>


export const ProductSchema = SchemaFactory.createForClass(Product);


export const ProductModule = MongooseModule.forFeatureAsync([
    { 
        name: Product.name, 
        useFactory() {

            ProductSchema.pre('updateOne', function(next) {
                log(this);
                log(this.getQuery());
                log(this.getUpdate());
                let update = this.getUpdate();

                if (!update) {
                    return next();
                }
                
                if (update['name']) {
                    update['slug'] = slugify(update['name'] , {trim: true});
                }
                this.setUpdate(update);

                next();
            });

            return ProductSchema;
        },
    },
]);