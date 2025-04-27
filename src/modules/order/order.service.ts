import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/DB/model/User.model';
import { CartRepositoryService } from 'src/DB/repository/Cart.repository.service';
import { CartDocument } from 'src/DB/model/Card.model';
import { IOrder, IOrderProduct, OrderStatus, PaymentMethod } from './order.interface';
import { ProductRepositoryService, ProductsPopulateList } from 'src/DB/repository/Product.repository.service';
import { ProductDocument } from 'src/DB/model/Product.model';
import { OrderRepositoryService } from 'src/DB/repository/Order.repository.service';
import { OrderDocument } from 'src/DB/model/Order.model';
import { CartService } from '../cart/cart.service';
import { Types } from 'mongoose';
import { PaymentService } from 'src/commen/service/payment.service';
import Stripe from 'stripe';
import { Request } from 'express';
import { log } from 'node:console';
import { RealTimeGateway } from '../gateways/gateway';



@Injectable()
export class OrderService {
  constructor(
    private readonly productRepositoryService: ProductRepositoryService<ProductDocument>,
    private readonly cartRepositoryService:CartRepositoryService<CartDocument>,
    private readonly orderRepositoryService: OrderRepositoryService<OrderDocument>,
    private readonly cartService: CartService,
    private paymentService:PaymentService,
    private realTimeGateway: RealTimeGateway
  ) {}

  
  async create(
    user: UserDocument,
    body: CreateOrderDto
  ) : Promise<{ message: string , data: { order: OrderDocument} }>{
    
    const cart = await this.cartRepositoryService.findOne({
      filter: {createdBy: user._id}
    })
    if(!cart?.products?.length) {
      throw new BadRequestException('Empty cart')
    }


    let subTotal: number = 0;

    let products: IOrderProduct[] = []
    for (const product of cart.products) {
      const checkProduct = await this.productRepositoryService.findOne({
        filter: {
          _id: product.productId,
          stock: { $gte: product.quantity}
        }
      })

      if(!checkProduct) {
        throw new BadRequestException('In-valid product or out of stock: ' + product.productId)
      }

      products.push({
        name: checkProduct.name,
        productId: product.productId,
        quantity: product.quantity,
        unitPrice: checkProduct.finalPrice,
        finalPrice: product.quantity * checkProduct.finalPrice
      })

      subTotal += product.quantity * checkProduct.finalPrice;
    }

    let finalPrice = subTotal;
    if(body.discountPercent) {
      // finalPrice = Math.floor(
      //   subTotal - (body.discountPercent / 100) * subTotal
      // )

      finalPrice = Number(
        (subTotal - (body.discountPercent / 100) * subTotal).toFixed(2)
      );
    }

    const order = await this.orderRepositoryService.create({
      ...body,
      subTotal,
      finalPrice,
      discountAmount: body.discountPercent,
      products,
      createdBy: user._id,
    })

    await this.cartService.deleteToCart(user);

    let productStock : { productId: Types.ObjectId , stock: number }[] = [];

    for (const product of products) {
      const item = await this.productRepositoryService.findOneAndUpdate({
        filter: {
          _id: product.productId
        },
        data: {
          $inc: {
            stock: -product.quantity
          }
        }
      })

      productStock.push({
        productId: item._id,
        stock: item.stock 
      })
    }


    this.realTimeGateway.emitChangesProductStock(productStock);

    return {
      message: 'Order created successfully',
      data: { order }
    };
  }


  async checkout(
    user: UserDocument,
    orderId: Types.ObjectId
  ) : Promise<{ 
    message: string , 
    data: { session: Stripe.Response<Stripe.Checkout.Session> , intentClientSecret: any } 
  }> {

    const order = await this.orderRepositoryService.findOne({
      filter: {
        _id: orderId,
        createdBy: user._id,
        status: OrderStatus.pending,
        paymentMethod:PaymentMethod.card
      }
    })

    if(!order){
      throw new BadRequestException('Order not found')
    }

    let discounts : { coupon: string }[] = [];
    if(order.discountAmount){
      const coupon = await this.paymentService.createCoupon({
          percent_off: order.discountAmount,
          duration: 'once'
      });
      discounts.push({ coupon: coupon.id });
    }

    const session =  await this.paymentService.checkoutSession({
      customer_email: user.email,
      line_items: order.products.map((product) => {
        return {
          quantity: product.quantity,
          price_data:{
              product_data:{
                  name: product.name,
              },
              currency:'egp',
              unit_amount: Math.round(product.unitPrice * 100),
              // unit_amount: product.unitPrice * 100,
          },
        }
      }),
      metadata: {
        orderId: orderId as unknown as string
      },
      cancel_url: `${process.env.CANCEL_URL}/order/${orderId}/cancel`,
      success_url: `${process.env.SUCCESS_URL}/order/${orderId}/success`,
      discounts
    })

    const intent = await this.paymentService.createPaymentIntent(
      order.finalPrice
    )

    // log({intent});

    await this.orderRepositoryService.updateOne({
      filter: {
        _id: orderId
      },
      data: {
        intentId: intent.id,
      }
    })

    return {
      message : 'Order checkout successfully',
      data: {
        session,
        intentClientSecret: intent.client_secret   // client_secret to frontend not work
      }
    }
  }


  async webhook (
    req: Request
  ){
    // log({req})
    return this.paymentService.webhook(req) 
  }


  async cancelOrder(
    user: UserDocument,
    orderId: Types.ObjectId,
  ) : Promise<{ message: string }> {

    const order = await this.orderRepositoryService.findOne({
      filter: {
        _id: orderId,
        createdBy: user._id,
        $or: [
          {status: OrderStatus.pending},
          {status: OrderStatus.placed}
        ],
        paymentMethod: PaymentMethod.card,
      }
    })

    // if(!order){
    if(!order?.intentId){
      throw new BadRequestException('Order not found')
    }

    let refund = {};
    if(
      order.paymentMethod === PaymentMethod.card || 
      order.status === OrderStatus.placed
    ){
      //refund
      refund = { refundAmount: order.finalPrice , refundDate: Date.now() };
      // await this.paymentService.refund(order.intentId as string);
      await this.paymentService.refund(order.intentId);
    }

    await this.orderRepositoryService.updateOne({
      filter: {
        _id: orderId,
      },
      data: {
        status: OrderStatus.canceled,
        ...refund,
        updatedBy: user._id,
      }
    });

    for (const product of order.products) {
      await this.productRepositoryService.updateOne({
        filter: {
          _id: product.productId,
        },
        data:{
          $inc: { stock: product.quantity },
        }
      })
    }

    return {
      message: 'Order canceled successfully'
    }

  }

  
  async findAll() : Promise<any> {

    const orders = await this.orderRepositoryService.find({ 
      populate: [
        { path: 'createdBy' } , 
        { path: 'products' , populate: 
          { path: 'productId' , populate: ProductsPopulateList } 
        } ,
      ]
    });

    // log('orders' , orders);
    return orders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
