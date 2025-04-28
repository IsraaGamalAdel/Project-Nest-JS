import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserDocument } from 'src/DB/model/User.model';
import { ReviewRepositoryService } from 'src/DB/repository/Review.repository.service';
import { ReviewDocument } from 'src/DB/model/Review.model';
import { ProductRepositoryService } from 'src/DB/repository/Product.repository.service';
import { ProductDocument } from 'src/DB/model/Product.model';

@Injectable()
export class ReviewService {


  constructor(
    private readonly reviewRepositoryService: ReviewRepositoryService<ReviewDocument>,
    private readonly productRepositoryService: ProductRepositoryService<ProductDocument>
  ){}


  async create(
    user: UserDocument,
    data: CreateReviewDto
  ) {
    const { comment, productId, rate } = data;

    const product = await this.productRepositoryService.findOne({
      filter: {
        _id: productId
      }
    })

    if(!product) {
      throw new NotFoundException('Product not found')
    }

    const checkReview = await this.reviewRepositoryService.findOne({
      filter: {
        productId,
        createdBy: user._id
      }
    })

    if(checkReview) {
      throw new BadGatewayException('Review already exist')
    }

    const review = await this.reviewRepositoryService.create({
      comment,
      rate,
      productId,
      createdBy: user._id
    })

    return {
      message: 'Review created successfully',
      data: review
    }
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
