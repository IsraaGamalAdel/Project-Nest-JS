import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./create.dto";
import { Types } from "mongoose";
import { IsMongoId, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { QueryFilterDto } from "src/commen/dto/query.filter.dto";


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class categoryIdDto {

    @IsMongoId()
    categoryId: Types.ObjectId
}


export class CategoryFilterQueryDto  extends QueryFilterDto{
    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string
}


