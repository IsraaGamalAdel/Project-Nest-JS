import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddToCartDto } from './dto/create-cart.dto';
import { UserDocument } from 'src/DB/model/User.model';
import { ProductRepositoryService } from 'src/DB/repository/Product.repository.service';
import { ProductDocument } from 'src/DB/model/Product.model';
import { CartRepositoryService } from 'src/DB/repository/Cart.repository.service';
import { CartDocument } from 'src/DB/model/Card.model';
import { ItemIdsDto } from './dto/update-cart.dto';
import { ICart } from './cart.interface';


@Injectable()
export class CartService {

  constructor (

    private readonly cartRepositoryService: CartRepositoryService<CartDocument>,
    private readonly productRepositoryService:ProductRepositoryService<ProductDocument>

  ) {}

  async addToCart(
    user: UserDocument,
    body: CreateAddToCartDto
  ) : Promise<{ message: string , data: { cart:ICart | null} }> {
    const product = await this.productRepositoryService.findOne({
        filter: {
          _id: body.productId,
          stock: { $gte: body.quantity }
        }
    })

    if(!product) {
      throw new NotFoundException('Product or out of stock not found')
    }

    const cart = await this.cartRepositoryService.findOne({
      filter: {
        createdBy: user._id,
      }
    })

    if(!cart) {
      const newCart = await this.cartRepositoryService.create({
        createdBy: user._id,
        products: [body]
      });

      return {
        message: 'Product added to cart successfully',
        data : { cart: newCart}
      }
    }

    let match = false;
    for ( const [index , product] of cart.products.entries() ) {
      if( product.productId.toString() === body.productId.toString() ) {
        cart.products[index].quantity = body.quantity;
        match = true;
        break;
      }
    }

    if(!match) {
      cart.products.push(body);
    }

    await cart.save();

    return {
      message: 'Product added to cart successfully',
      data: { cart}
    } ;
  }


  async removeItemsToCart(
    user: UserDocument,
    body: ItemIdsDto
  ) : Promise<{ message: string }> {

    const cart = await this.cartRepositoryService.updateOne({
      filter: {
        createdBy: user._id,
      },
      data: {
        $pull: {
          products: {
            productId: { $in: body.productIds}
          }
        }
      }
    })

    return {
      message: 'Product removed successfully'
    }
  }


  async deleteToCart(
    user: UserDocument,
  ) : Promise<{ message: string }> {

    const checkCart = await this.cartRepositoryService.findOne({
      filter: {
        createdBy: user._id
      }
    });

    if(!checkCart) {
      throw new NotFoundException('Cart not found')
    }

    if (!checkCart.products.length) {
      return {
        message: "Cart is already deleted"
      }
    }

    const deleteCart = await this.cartRepositoryService.updateOne({
      filter: {
        createdBy: user._id
      },
      data: {
        products: []
      }
    })

    if(!deleteCart) {
      throw new NotFoundException('Cart not found')
    }

    return {
      message: 'Cart deleted successfully'
    }
  }


  async getToCart(
    user: UserDocument
  ) : Promise<{ message: string , data: { getCart: ICart | null } }> {

    const getCart = await this.cartRepositoryService.findOne({
      filter: {
        createdBy: user._id
      },
      populate: [{ path : 'products.productId' }]
    })

    return {
      message: 'Cart get successfully',
      data: {
        getCart
      }
    }
  }
}
