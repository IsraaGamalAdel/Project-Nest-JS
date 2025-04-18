import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateAddToCartDto } from './dto/create-cart.dto';
import { ItemIdsDto } from './dto/update-cart.dto';
import { Auth } from 'src/commen/decorators/auth.decorators';
import { RoleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/commen/decorators/user.decorators';



@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}


  @Auth([RoleTypes.user])
  @Post()
  addToCart(
    @User() user: UserDocument,
    @Body() body: CreateAddToCartDto
  ){
    return this.cartService.addToCart(user , body)
  }


  @Auth([RoleTypes.user])
  @Patch()
  removeItemsToCart(
    @User() user: UserDocument,
    @Body() body: ItemIdsDto
  ){
    return this.cartService.removeItemsToCart(user , body)
  }


  @Auth([RoleTypes.user])
  @Delete()
  deleteToCart(
    @User() user: UserDocument,
  ){
    return this.cartService.deleteToCart(user)
  }


  @Auth([RoleTypes.user])
  @Get()
  getToCart(
    @User() user: UserDocument,
  ){
    return this.cartService.getToCart(user)
  }
}
