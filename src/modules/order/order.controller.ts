import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderIdDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/commen/decorators/auth.decorators';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/commen/decorators/user.decorators';
import { Request } from 'express';



@UsePipes(new ValidationPipe({ whitelist: true}))


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth([RoleTypes.user])
  @Post()
  create(
    @User() user: UserDocument,
    @Body() body: CreateOrderDto
  ) {
    return this.orderService.create(user , body);
  }


  @Post('webhook')
  webhook(
    @Req() req: Request
  ) {
    return this.orderService.webhook(req);
  }


  @Auth([RoleTypes.user])
  @Post(':orderId')
  checkout(
    @User() user: UserDocument,
    @Param() params: OrderIdDto
  ) {
    return this.orderService.checkout(user , params.orderId);
  }


  @Auth([RoleTypes.user])
  @Patch(":orderId/cancel")
  cancelOrder(
    @User() user: UserDocument,
    @Param() params: OrderIdDto
  ) {
    return this.orderService.cancelOrder(user , params.orderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
