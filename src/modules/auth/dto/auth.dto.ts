import { Allow, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { IsMatchPassword } from "src/commen/decorators/password.custom.decorators";


export class LoginDto {
    
    @IsEmail()
    email: string;
    @IsStrongPassword()
    password: string;
}


export class CreateUserDto extends LoginDto {
    @IsString({message: 'userName is required field'})
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    userName: string;
    
    // @IsEmail()
    // // @IsOptional()
    // // @Allow() // not Validation
    // email: string;
    // @IsStrongPassword()
    // password: string;
    
    
    // @IsStrongPassword()

    @IsMatchPassword({
        message: "password mis match confirmPassword"
    })
    confirmPassword: string;
}

