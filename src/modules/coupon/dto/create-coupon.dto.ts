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

export class CreateCouponDto {

    @IsString()
    @IsNotEmpty()
    code: string;


    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @Validate(CheckCouponFromDate)
    fromDate: Date;


    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @Validate(CheckCouponToDate)
    toDate: Date;


    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    amount: number

}
