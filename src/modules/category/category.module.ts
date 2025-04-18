import { BadRequestException, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModule } from 'src/DB/model/Category.model';
import { CategoryRepositoryService } from 'src/DB/repository/Category.repository.service';
import { CloudinaryService } from 'src/commen/multer/cloud.service';
import { MulterValidationInterceptor } from 'src/commen/multer/multer-validation/multer-validation.interceptor';



@Module({
  imports: [ 
    // MulterModule.register(),
    CategoryModule ,
  ],


  controllers: [CategoryController , ],
  providers: [CategoryService , CategoryRepositoryService, CloudinaryService , MulterValidationInterceptor],
})
export class GetCategoryModule {}
