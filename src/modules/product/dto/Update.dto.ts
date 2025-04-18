import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Types } from "mongoose";
import { CreateProductDto } from "./Create.dto";
import { QueryFilterDto } from "src/commen/dto/query.filter.dto";
import { Type } from "class-transformer";



export class UpdateProductIdDto {
    @IsMongoId()
    productId: Types.ObjectId
}


export class UpdateProductDto extends PartialType( CreateProductDto ) {}


export class FindProductFilter extends QueryFilterDto{


    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    minPrice?: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    maxPrice?: number;


    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;


    @IsMongoId()
    @IsOptional()
    categoryId?: string
}