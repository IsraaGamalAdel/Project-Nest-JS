import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/commen/decorators/auth.decorators';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/commen/decorators/user.decorators';
import { CreateProductDto } from './dto/Create.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudMulterOptions } from 'src/commen/multer/cloud.multer.options';
import { validationFile } from 'src/commen/multer/options.multer';
import { MulterValidationInterceptor } from 'src/commen/multer/multer-validation/multer-validation.interceptor';
import { FindProductFilter, UpdateProductDto, UpdateProductIdDto } from './dto/Update.dto';



@UsePipes( new ValidationPipe({ whitelist: true}))

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'gallery', maxCount: 5 },
      ] , 
      CloudMulterOptions({
        fileValidators: validationFile.image,
        fileSize: 1024 * 1024 * 5
      })
    ),
    new MulterValidationInterceptor('image')
  )
  @Auth([RoleTypes.admin])
    @Post()
    create(
      @User() user: UserDocument,
      @Body() body: CreateProductDto,
      @UploadedFiles() files: {
        image: Express.Multer.File[],
        gallery?: Express.Multer.File[],
      }
    ) {
      return this.productService.create( user , body , files);
    }


    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'image', maxCount: 1 },
          { name: 'gallery', maxCount: 5 },
        ] , 
        CloudMulterOptions({
          fileValidators: validationFile.image,
          fileSize: 1024 * 1024 * 5
        })
      ),
    )
    @Auth([RoleTypes.admin])
      @Patch(':productId')
      update(
        @User() user: UserDocument,
        @Param() params: UpdateProductIdDto,
        @Body() body: UpdateProductDto,
        @UploadedFiles() files?: {
          image?: Express.Multer.File[],
          gallery?: Express.Multer.File[],
        }
      ) {
        return this.productService.update( user , params.productId , body , files);
      }


    @Get()
    listFind(
      @Query() query: FindProductFilter
    ){
        return this.productService.listFind( query );
    }
}
