import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ProductRepositoryService } from 'src/DB/repository/Product.repository.service';
import { ReviewRepositoryService } from 'src/DB/repository/Review.repository.service';
import { ReviewModule } from 'src/DB/model/Review.model';
import { ProductModule } from 'src/DB/model/Product.model';



@Module({
  imports: [ ReviewModule , ProductModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ProductRepositoryService,
    ReviewRepositoryService
  ],
})
export class GetReviewModule {}
