import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query, Redirect, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { log } from 'console';
import { AuthenticationService } from './auth.service';
// import { CustomValidationPipe } from 'src/commen/pipes/password.custom.pipes';
import { CreateUserDto } from './dto/auth.dto';
import { CreateSignUpDto, createUserSchema } from './auth.validation.schema';
import { CustomClassValidationPipe } from 'src/commen/pipes/password.custom.valiationClass';



//Global 
// @UsePipes(
//     new ValidationPipe({
//         whitelist: true, 
//         forbidNonWhitelisted: true ,
//         stopAtFirstError: false ,     //stopAtFirstError: true (return first error) ,
//         skipNullProperties: false     //skipNullProperties: true  (return felid null),
        
//     })
// )

@UsePipes(
    new CustomClassValidationPipe({
        whitelist: true, 
        forbidNonWhitelisted: true ,
        stopAtFirstError: false ,     //stopAtFirstError: true (return first error) ,
        skipNullProperties: false     //skipNullProperties: true  (return felid null),
        
    })
)


@Controller('auth/')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}

    

    @Post('signup')
    signup(
        @Body() 
        body:CreateUserDto,   
        // @Body(new CustomValidationPipe(createUserSchema)) body:CreateSignUpDto, 
    ) :{
        message: string;
        data: any;
    } {
        log({body:body});
        return this.authenticationService.signup(body);
    }


    @Get('login')
    login(){
        return {
            message: 'hello page login'
        }
    }
}



// export class AuthenticationController {
//     constructor(private readonly authenticationService: AuthenticationService) {}

//     @Post('signup/:id')
//     // @Redirect('/auth/login' , 301) // redirect page  || 2 link
//     // @HttpCode(200)  // change status code
//     signup(
//         // @Req() req:Request ,
//         // @Body('userName') userName:string
//         // @Param() params:number,
//         // @Query() query:any,
//         // @Headers() headers:any

//         @Body() body:any,
//     ) :{
//         message: string;
//         data: any;
//     } {
//         // const {userName , gender} = body
//         // console.log({userName , gender});
//         // log(params)
//         // log(query)
//         // console.log(headers);
//         return this.authenticationService.signup();
//     }


//     @Get('login')
//     login(){
//         return {
//             message: 'hello page login'
//         }
//     }
// }