import { IsString, MaxLength, MinLength } from "class-validator";



export class CreateCategoryDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string
}