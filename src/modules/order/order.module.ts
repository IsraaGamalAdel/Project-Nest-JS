import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartRepositoryService } from 'src/DB/repository/Cart.repository.service';
import { CartModule } from 'src/DB/model/Card.model';
import { ProductRepositoryService } from 'src/DB/repository/Product.repository.service';
import { OrderRepositoryService } from 'src/DB/repository/Order.repository.service';
import { CartService } from '../cart/cart.service';
import { ProductModule } from 'src/DB/model/Product.model';
import { OrderModule } from 'src/DB/model/Order.model';
import { PaymentService } from 'src/commen/service/payment.service';
import { RealTimeGateway } from '../gateways/gateway';




@Module({
  imports:[CartModule , ProductModule , OrderModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    ProductRepositoryService,
    CartRepositoryService,
    OrderRepositoryService,
    CartService,
    PaymentService,
    RealTimeGateway
  ],
})
export class GetOrderModule {}
