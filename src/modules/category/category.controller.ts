import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/commen/decorators/auth.decorators';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions, validationFile } from 'src/commen/multer/options.multer';
import { User } from 'src/commen/decorators/user.decorators';
import { CloudMulterOptions } from 'src/commen/multer/cloud.multer.options';
import { CreateCategoryDto } from './dto/create.dto';
import { MulterValidationInterceptor } from 'src/commen/multer/multer-validation/multer-validation.interceptor';
import { CategoryFilterQueryDto, categoryIdDto, UpdateCategoryDto } from './dto/update.dto';




@UsePipes(
  new ValidationPipe({
    whitelist: true,
  })
)

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseInterceptors(
    FileInterceptor(
      'file' , 
      CloudMulterOptions({
        // path: 'category',  

        // fileValidators: ['image/jpeg' , 'image/png'],
        fileValidators: validationFile.image,
        fileSize: 1024 * 1000
      })
    ),
    new MulterValidationInterceptor()
  )
  @Auth([RoleTypes.admin])
  @Post()
  create(

    @UploadedFile() file: Express.Multer.File,

    @User() user: UserDocument,
    @Body() body: CreateCategoryDto
  ){
    
    return this.categoryService.create(file , body , user)
  }



  @UseInterceptors(
    FileInterceptor(
      'file' , 
      CloudMulterOptions({
        fileValidators: validationFile.image,
        fileSize: 1024 * 1000
      })
    ),
    // new MulterValidationInterceptor(false)
  )
  @Auth([RoleTypes.admin])
  @Patch(":categoryId")
  update(

    @Param() params: categoryIdDto,
    @Body() body?: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,

  ){
    
    return this.categoryService.update( params.categoryId , body , file)
  }


  @Get(":categoryId")
  getOneIdCategory(
    @Param() params: categoryIdDto,
  ){
    return this.categoryService.getOneIdCategory( params.categoryId )
  }


  @Get()
  getAllCategory(
    @Query() query: CategoryFilterQueryDto
  ){ 
    return this.categoryService.getAllCategory( query )
  }
}
