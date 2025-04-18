import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from 'src/DB/model/User.model';
import { CreateProductDto } from './dto/Create.dto';
import { log } from 'console';
import { CategoryRepositoryService } from 'src/DB/repository/Category.repository.service';
import { CategoryDocument } from 'src/DB/model/Category.model';
import { CloudinaryService, IAttachment } from 'src/commen/multer/cloud.service';
import { ProductRepositoryService } from 'src/DB/repository/Product.repository.service';
import { ProductDocument } from 'src/DB/model/Product.model';
import { Types } from 'mongoose';
import { FindProductFilter, UpdateProductDto } from './dto/Update.dto';
import { FilterQuery } from 'mongoose';
import { IProduct } from './product.interface';
import { IPaginate } from 'src/DB/repository/db.repository';



@Injectable()
export class ProductService {

    constructor (
        private readonly cloudinaryService: CloudinaryService,
        private readonly productRepositoryService: ProductRepositoryService<ProductDocument>,
        private readonly categoryRepositoryService: CategoryRepositoryService<CategoryDocument>
    ) {}

    async create( 
        user: UserDocument,
        body: CreateProductDto,
        files: { 
            image: Express.Multer.File[], 
            gallery?: Express.Multer.File[] 
        }
    ) {

        const category = await this.categoryRepositoryService.findOne({
            filter: {_id: body.categoryId}
        });

        if(!category){
            throw new NotFoundException('categoryId not found')
        }
        
        const folderId = String(
            Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
        )
        let {secure_url , public_id} = await this.cloudinaryService.uploadFile(
            files.image[0] , 
            {
                folder: `${process.env.APP_NAME}/category/${category.folderId}/product/${folderId}`
            },
        )

        let gallery: IAttachment[] = [];

        if(files.gallery && files.gallery.length > 0) {
            gallery = await this.cloudinaryService.uploadFiles( 
                files.gallery,
                {
                    folder: `${process.env.APP_NAME}/category/${category.folderId}/product/${folderId}/gallery`
                },
            )
        }

        const finalPrice = this.calculatorFinalPrice(
            body.originalPrice ,
            body.discountPercent
        )

        const product = await this.productRepositoryService.create({
            ...body,
            image: { secure_url , public_id },
            gallery,
            folderId,
            finalPrice,
            createdBy: user._id
        })
        return {
            message: 'Product created successfully',
            data: {product}
        }
    }


    async update( 
        user: UserDocument,
        productId: Types.ObjectId, 
        body: UpdateProductDto,
        files?: { 
            image?: Express.Multer.File[], 
            gallery?: Express.Multer.File[] 
        }
    ) {

        const product = await this.productRepositoryService.findOne({
            filter: {_id: productId},
            populate: [{ path: 'categoryId' }]
        })

        if(!product) {
            throw new NotFoundException('Product not found')
        }

        if(body.categoryId) {
            const category = await this.categoryRepositoryService.findOne({
                filter: {_id: body.categoryId}
            });
    
            if(!category){
                throw new NotFoundException('categoryId not found')
            }
        }

        let image: IAttachment | undefined;
        if(files?.image?.length) {
            let {secure_url , public_id} = await this.cloudinaryService.uploadFile(
                files.image[0] , 
                {
                    folder: `${process.env.APP_NAME}/category/${ product.categoryId['folderId'] }/product/${product.folderId}`
                },
            );
            image = { secure_url , public_id }
        }

        let gallery: IAttachment[] = [];
        if(files?.gallery?.length) {
            gallery = await this.cloudinaryService.uploadFiles( 
                files.gallery,
                {
                    folder: `${process.env.APP_NAME}/category/${product.categoryId['folderId'] }/product/${product.folderId}/gallery`
                },
            )
        }
        
        let finalPrice: number = product.finalPrice;

        if(body.originalPrice || body.discountPercent) {
            finalPrice = this.calculatorFinalPrice(
                body.originalPrice || product.originalPrice,
                body.discountPercent || product.discountPercent
            )
        }

        const UpdateProduct = await this.productRepositoryService.updateOne({
            filter: {_id: productId},
            data: { ...body, image , gallery, finalPrice, }
        })

        if(UpdateProduct.modifiedCount && files?.image?.length) {
            await this.cloudinaryService.destroyFile(product.image.public_id);
        }
        
        if(UpdateProduct.modifiedCount && files?.gallery?.length && product.gallery?.length) {
            const ids = product.gallery.map( (element) => element.public_id );
            await this.cloudinaryService.destroyFiles(ids);

            //deleted folder not working
            // await this.cloudinaryService.destroyFolderAssets(
            //     `${process.env.APP_NAME}/category/${product.categoryId['folderId'] }/product/${product.folderId}/gallery`
            // )
        }

        return {
            message: 'Product created successfully',
            data: {
                UpdateProduct:{
                    name: body.name || product.name,
                }
            }
        }
    }


    async listFind(
        query: FindProductFilter,
    ) : Promise< {
        message: string,
        data:{
            products: IProduct[] | [] | IPaginate<IProduct> 
        }
    } > {
        let filter : FilterQuery<ProductDocument> = {}
        if(query?.name) {
            filter = {
                $or: [ 
                    {name: { $regex: `${query.name}` , $options: 'i' } },
                    {slug: { $regex: `${query.name}` , $options: 'i' } }
                ]
            }
        }

        if(query.categoryId) {
            filter.categoryId = query.categoryId
        }

        if(query.minPrice || query.maxPrice) {
            let max = query.maxPrice ? {$lte: query.maxPrice} : {};
            filter.finalPrice = { $gte: query.minPrice || 0, ...max}
        }

        const products = await this.productRepositoryService.find({
            filter,
            select: query.select,
            sort: query.sort,
            page: query.page,
            populate: [{ path: 'categoryId' }]
        })

        return {
            message: 'list Products' , 
            data: {
                products
            }
        }
    }

    private calculatorFinalPrice(
        originalPrice: number,
        discountPercent?: number,
    ) : number {
         const price = originalPrice - ( (discountPercent || 0) / 100) * originalPrice;

        return price > 0 ? price : 0
    }
}
