import { Types } from "mongoose";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';



@ValidatorConstraint({ name: 'Check_mongo_ids', async: false })
export class CheckMongoIds implements ValidatorConstraintInterface {
    validate(ids: Types.ObjectId[] , args: ValidationArguments) {
        for (const id of ids) {
            if(!Types.ObjectId.isValid(id)) {
                return false;
            }
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return 'In-valid mongo id';
    }
}


export class  ItemIdsDto {

    @Validate(CheckMongoIds)
    productIds: Types.ObjectId;
}