import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { OrderStatus } from '../order.interface';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}


@InputType()
export class filterOrderDto {

    @Field( ()=> OrderStatus  , {nullable: true})
    @IsString()
    @MinLength(2)
    @IsOptional()
    status?: OrderStatus
}