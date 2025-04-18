import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepositoryService } from 'src/DB/repository/Product.repository.service';
import { CategoryRepositoryService } from 'src/DB/repository/Category.repository.service';
import { CloudinaryService } from 'src/commen/multer/cloud.service';
import { CategoryModule } from 'src/DB/model/Category.model';
import { ProductModule } from 'src/DB/model/Product.model';
import { MulterValidationInterceptor } from 'src/commen/multer/multer-validation/multer-validation.interceptor';



@Module({
  imports: [ProductModule , CategoryModule ],
  controllers: [ProductController],
  providers: [
    ProductService ,
    ProductRepositoryService , 
    CategoryRepositoryService , 
    CloudinaryService , 
    MulterValidationInterceptor
  ],
})
export class GetProductModule {}
