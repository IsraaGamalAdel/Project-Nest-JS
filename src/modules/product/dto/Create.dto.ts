import { IsArray, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { IProductInputs, ProductSize } from "../product.interface";
import { Type } from "class-transformer";
import { Types } from "mongoose";



export class CreateProductDto implements IProductInputs {
    
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;


    @IsString()
    @MinLength(2)
    @MaxLength(50000)
    description: string;


    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    stock: number;


    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    originalPrice: number;


    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    discountPercent?: number;


    @IsMongoId()
    categoryId: Types.ObjectId;

    @IsArray()
    @IsOptional()
    colors?: string[];

    @IsArray()
    @IsOptional()
    size?: ProductSize[];
}