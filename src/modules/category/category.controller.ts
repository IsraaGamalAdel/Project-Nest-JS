import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/commen/decorators/auth.decorators';
import { RoleTypes } from 'src/DB/model/User.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from 'src/commen/multer/options.multer';



@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseInterceptors(FileInterceptor('file' , MulterOptions({
    path: 'category',
    fileValidators: ['image/jpeg' , 'image/png'],
    fileSize: 1024 * 1000
  })))

  @Auth([RoleTypes.admin])

  @Post()
  create(

    @UploadedFile() file: Express.Multer.File,

    @Body() body: any){
    
    return this.categoryService.create(file , body)
  }
}
