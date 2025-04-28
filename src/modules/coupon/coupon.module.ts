import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepositoryService } from 'src/DB/repository/Coupon.repository.service';
import { CouponModule } from 'src/DB/model/Coupon.model';



@Module({
  imports: [CouponModule],
  controllers: [CouponController],
  providers: [
    CouponService , CouponRepositoryService , 
  ],
})
export class GetCouponModule {}
