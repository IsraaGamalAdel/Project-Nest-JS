import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepositoryService } from 'src/DB/repository/Cart.repository.service';
import { ProductRepositoryService } from 'src/DB/repository/Product.repository.service';
import { ProductModule } from 'src/DB/model/Product.model';
import { CartModule } from 'src/DB/model/Card.model';



@Module({
  imports: [ProductModule , CartModule],
  controllers: [CartController],
  providers: [CartService , CartRepositoryService , ProductRepositoryService],
})
export class GetCartModule {}
