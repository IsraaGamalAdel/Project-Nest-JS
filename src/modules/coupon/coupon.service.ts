import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponIdDto, UpdateCouponDto } from './dto/update-coupon.dto';
import { UserDocument } from 'src/DB/model/User.model';
import { CouponRepositoryService } from 'src/DB/repository/Coupon.repository.service';
import { CouponDocument } from 'src/DB/model/Coupon.model';
import { Types } from 'mongoose';

@Injectable()
export class CouponService {

  constructor(
    private readonly couponRepositoryService: CouponRepositoryService<CouponDocument>
  ){}



  async create(
    user: UserDocument,
    data: CreateCouponDto
  ) : Promise<{message: string , data: CouponDocument}> {
    const { code, fromDate, toDate, amount } = data;

    // const coupon = await this.couponRepositoryService.findOne({
    //   filter: {
    //     code
    //   }
    // })

    // if(coupon){
    //   throw new ConflictException('Coupon already exist')
    // }

    await this.couponRepositoryService.checkDuplicateCoupon({code})
    

    const createCoupon = await this.couponRepositoryService.create({
      code,
      fromDate,
      toDate,
      amount,
      createdBy: user._id
    })
    return {
      message: 'Coupon created successfully',
      data: createCoupon
    };
  }

  findAll() {
    return `This action returns all coupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }



  async update(
    user: UserDocument,
    params: CouponIdDto, 
    data?: UpdateCouponDto
  ) {

    const coupon = await this.couponRepositoryService.findOne({
      filter: {
        _id: params.couponId,
        createdBy: user._id
      }
    })
  
    if(!coupon){
      throw new NotFoundException('Coupon not found or not user')
    }

    const updateCoupon = await this.couponRepositoryService.findOneAndUpdate({
      filter: {
        _id: params.couponId,
        createdBy: user._id
      },
      data: {
        ...data
      },
    })

    return {
      message: 'Coupon update successfully',
      data: updateCoupon
    }
  }


  
  async remove(
    user: UserDocument,
    params: CouponIdDto
  ) {

    const coupon = await this.couponRepositoryService.findOne({
      filter: {
        _id: params.couponId
      }
    })

    if(!coupon){
      throw new NotFoundException('Coupon not found')
    }

    const deleteCoupon = await this.couponRepositoryService.findOneAndDelete({
      filter: {
        _id: params.couponId,
        createdBy: user._id
      }
    })


    return {
      message: 'Coupon deleted successfully',
      data: deleteCoupon
    };
  }
}
