import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, ValidationPipeOptions } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';





@Injectable()
export class CustomClassValidationPipe implements PipeTransform<any> {
    constructor(private options? : ValidationPipeOptions) {}
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToInstance(metatype, value);
        const errors = await validate(object ,this.options);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
