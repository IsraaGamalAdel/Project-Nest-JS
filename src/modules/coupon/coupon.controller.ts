import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponIdDto, UpdateCouponDto } from './dto/update-coupon.dto';
import { Auth } from 'src/commen/decorators/auth.decorators';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/commen/decorators/user.decorators';
import { Types } from 'mongoose';



@UsePipes( new ValidationPipe({ whitelist: true}))


@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Auth([RoleTypes.admin])
  create(
    @User() user: UserDocument,
    @Body() data: CreateCouponDto
  ) {
    return this.couponService.create(user , data);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(+id);
  }

  @Patch(':couponId/updateCoupon')
  @Auth([RoleTypes.admin])
  update(
    @User() user: UserDocument,
    @Param() params: CouponIdDto, 
    @Body() data?: UpdateCouponDto
  ) {
    return this.couponService.update( user ,params, data);
  }



  @Delete(':couponId')
  @Auth([RoleTypes.admin])
  remove(
    @User() user: UserDocument,
    @Param() params: CouponIdDto, 
  ) {
    return this.couponService.remove( user , params);
  }
}
