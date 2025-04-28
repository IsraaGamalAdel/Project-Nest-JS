import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { log } from 'console';
import { CloudinaryService, IAttachment } from 'src/commen/multer/cloud.service';
import { UserDocument } from 'src/DB/model/User.model';
import { CreateCategoryDto } from './dto/create.dto';
import { CategoryRepositoryService } from 'src/DB/repository/Category.repository.service';
import { CategoryDocument } from 'src/DB/model/Category.model';
import { FilterQuery, Types } from 'mongoose';
import { CategoryFilterQueryDto, UpdateCategoryDto } from './dto/update.dto';
import { ICategory } from './category.interface';
import { IPaginate } from 'src/DB/repository/db.repository';




@Injectable()
export class CategoryService {

    constructor (
        private readonly cloudinaryService: CloudinaryService,
        // private readonly categoryRepositoryService: CategoryRepositoryService
        private readonly categoryRepositoryService: CategoryRepositoryService< CategoryDocument>
    ) {}

    async create( file: Express.Multer.File , body: CreateCategoryDto , user: UserDocument) {

        // if (!file) {
        //     throw new BadRequestException('file is required')
        // }

        // if(
        //     await  this.categoryRepositoryService.checkDuplicateCategory({
        //         name: body.name
        //     })
        // ) {
        //     throw new ConflictException('category already exist')
        // }

        await this.categoryRepositoryService.checkDuplicateCategory({name: body.name})

        const folderId = String(
            Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
        )

        const {secure_url , public_id} = await this.cloudinaryService.uploadFile(file ,{
            folder: `${process.env.APP_NAME}/category/${folderId}`
        })

        const category = await this.categoryRepositoryService.create({
            name: body.name,
            logo: {secure_url , public_id},
            folderId,
            createdBy: user._id
        })
        
        return  { 
            message: 'category created' ,
            data: category 
        }
    }


    async update(
        // user: UserDocument, 
        categoryId: Types.ObjectId,
        body?: UpdateCategoryDto,
        file?:Express.Multer.File,
    ) {

        const category = await this.categoryRepositoryService.findOne({
            filter: {_id: categoryId}
        })

        if(!category) {
            throw new NotFoundException('category not found')
        }

        if(body?.name && await this.categoryRepositoryService.findOne({
            filter: {name: body.name , _id: {$ne: categoryId} }
        })
        ) {
            throw new ConflictException('category already exist')
        }
        
        let logos: IAttachment | undefined;
        if(file){
            const {secure_url , public_id} = await this.cloudinaryService.uploadFile(
                file ,
                {
                    folder: `${process.env.APP_NAME}/category/${category.folderId}`
                }
            )
            logos = {secure_url , public_id};
        }

        const updatedCategory = await this.categoryRepositoryService.updateOne({
            filter: {
                _id: categoryId
            },
            data: {
                name: body?.name ,
                logo: logos ,
            }
        })

        if(updatedCategory.modifiedCount && file) {
            await this.cloudinaryService.destroyFile(category.logo.public_id)
        }

        return {
            message: 'category updated' ,
            data: {
                name: body?.name,
            }
        }
    }


    async getOneIdCategory(
        categoryId: Types.ObjectId
    ) : Promise<{message: string , data: { category:ICategory }}> {
        const category = await this.categoryRepositoryService.findOne({
            filter: {
                _id: categoryId
            },
            populate: [{ path: 'createdBy' }]
        })

        if (!category) {
            throw new NotFoundException('category not found')
        }

        return {
            message: 'category',
            data: {category}
        }
    }


    async getAllCategory(
        query: CategoryFilterQueryDto

    ) : Promise<{ message: string, data: {categories: ICategory[] | [] | IPaginate<ICategory>}}>{

        let filter: FilterQuery<CategoryDocument> = {};

        if(query?.name) {
            filter = {
                $or: [ 
                    {name: { $regex: `${query.name}` , $options: 'i' } },
                    {slug: { $regex: `${query.name}` , $options: 'i' } }
                ]
            }
        }

        const categories = await this.categoryRepositoryService.find({ 
            filter , 
            select: query.select , 
            sort: query.sort , 
            page: query.page ,
            populate: [ {path: 'createdBy'} ]
        })
        if(!categories) {
            throw new NotFoundException('category not found')
        }

        return {
            message: 'categories',
            data: {categories}
        }
    }
}
