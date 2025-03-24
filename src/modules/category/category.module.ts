import { BadRequestException, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModule } from 'src/DB/model/Category.model';
import { CategoryRepositoryService } from 'src/DB/repository/Category.repository.service';



@Module({
  imports: [ 
    // MulterModule.register(),
    CategoryModule 
  ],


  controllers: [CategoryController],
  providers: [CategoryService , CategoryRepositoryService, ],
})
export class GetCategoryModule {}
