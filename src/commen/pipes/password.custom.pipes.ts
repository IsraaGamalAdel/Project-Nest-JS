import { PipeTransform, Injectable, ArgumentMetadata, HttpException, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';


class AppError extends HttpException {
    constructor(message: string) {
        super(message, 400);
    }
}


@Injectable()
export class CustomValidationPipe implements PipeTransform {
    constructor(private schema : ZodSchema){}
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('====================================');
        console.log(
            {
                value, metadata
            }
        );
        console.log('====================================');
        // if(value.password !== value.confirmPassword){
        //     // throw new AppError('password not match');
        //     throw new BadRequestException('password not match');
        // }

        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            throw new BadRequestException(error);
        }

        return value;
    }
}


