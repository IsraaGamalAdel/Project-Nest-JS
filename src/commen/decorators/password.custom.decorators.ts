import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    } from 'class-validator';
import { log } from 'console';
    



@ValidatorConstraint({ async: false })
export class IsMatchPasswordConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments) {
        log({confirmPassword , args});
        log({x : args.object[args.constraints[0]]})
        
        const password = args.object[args.constraints[0]]

        // if(confirmPassword !== password){
        //     return false;
        // }
        // return true;
        
        return confirmPassword == password   // or if
    }
}
    
export function IsMatchPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,  //class
            propertyName: propertyName,  //assigned (confirmPassword)
            options: validationOptions,  //{message}
            constraints: ['password'],   // ['password']  // Optional
            validator: IsMatchPasswordConstraint,
        });
    };
}