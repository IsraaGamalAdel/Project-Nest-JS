import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, Max, Min, Validate, validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";





@ValidatorConstraint({
    async: true
})


export class CheckCouponToDate implements ValidatorConstraintInterface {
    validate(toDate: any , args: ValidationArguments) : Promise<boolean> | boolean{
        if(toDate < args?.object['fromDate']){
            return false;
        }

        return true;
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return ` ${validationArguments?.property} to date must be greater than from date ${validationArguments?.object['fromDate']}`;
    }
}

export class CheckCouponFromDate implements ValidatorConstraintInterface {
    validate(fromDate: any , args?: ValidationArguments) : Promise<boolean> | boolean{
        return fromDate >= new Date();
    }
}


export class UpdateCouponDto extends PartialType(CreateCouponDto) {

    @IsString()
    @IsOptional()
    code: string;
    
    
    @IsDate()
    @Type(() => Date)
    @Validate(CheckCouponFromDate)
    @IsOptional()
    fromDate: Date;
    
    
    @IsDate()
    @Type(() => Date)
    @Validate(CheckCouponToDate)
    @IsOptional()
    toDate: Date;
    
    
    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @IsOptional()
    amount: number

}



export class CouponIdDto {

    @IsMongoId()
    couponId: Types.ObjectId
}



