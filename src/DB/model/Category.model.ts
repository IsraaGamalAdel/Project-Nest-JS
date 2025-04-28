import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, ObjectId, Types } from "mongoose";
import slugify from "slugify";
import { IAttachment } from "src/commen/multer/cloud.service";
import { ICategory } from "src/modules/category/category.interface";



@Schema({
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})


// export class Category extends Document implements ICategory {
export class Category  implements ICategory {
    // @Prop({ type: Types.ObjectId })
    // _id: ObjectId

    @Prop({ 
        required: true , 
        minlength: 2 , 
        maxlength: 50 , 
        trim: true ,
    })
    name: string

    @Prop({ 
        required: true , 
        minlength: 2 , 
        maxlength: 75 , 
        //slugify default  افضل من  (Hook , set)
        // default 1 Step
        default: function ( this: Category) {
            return slugify(this.name ,  {trim: true})
        }

        // set 3 Step
        // set: (v: string) => {
        //     return slugify(v , {trim: true})
        // }
    })
    slug: string

    @Prop(raw({
        secure_url: {type: String , required: true},
        public_id: {type: String , required: true}
    }))
    logo: IAttachment

    @Prop({ required: true })
    folderId: string

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User'
    })
    createdBy: Types.ObjectId
}

export type CategoryDocument = HydratedDocument<Category>


export const CategorySchema = SchemaFactory.createForClass(Category);


export const CategoryModule = MongooseModule.forFeatureAsync([
    { 
        name: Category.name, 
        useFactory() {
            // CategorySchema.pre('save' , function(next) {
            //     // Hook 2 step
            //     // if(!this.slug || this.isModified('name')){
            //     //     // this.slug = slugify(this.name ,  {trim: true})
            //     //     // set 3 Step
            //     //     this.slug = this.name
            //     // }
            //     return next();
            // })


             // CategorySchema.pre('updateOne', function(next) {
            //     let update = this.getUpdate();

            //     if(update['name']){
            //         update['slug'] = slugify(update['name'] ,  {trim: true})
            //     }

            //     this.setUpdate(update)

            //     next();
            // })

            CategorySchema.pre('updateOne', function(next) {
                let update = this.getUpdate();

                // if (!update || typeof update !== 'object' || Array.isArray(update)) {
                if (!update ) {
                    return next();
                }
                if (update['name']) {
                    update['slug'] = slugify(update['name'], {trim: true});
                }
                this.setUpdate(update);
                next();
            });

            // CategorySchema.pre('updateOne', function(next) {
            //     const update = this.getUpdate();
                
            //     if (!update || typeof update !== 'object' || Array.isArray(update)) {
            //         return next();
            //     }
            //     if (update['name']) {
            //         update['slug'] = slugify(update['name'], {trim: true});
            //     }
            //     else if (update.$set?.name) {
            //         update.$set.slug = slugify(update.$set.name, {trim: true});
            //     }
            //     this.setUpdate(update as UpdateQuery<any>);
            //     next();
            // });


            return CategorySchema
        } 
    }
])