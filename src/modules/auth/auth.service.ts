import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/DB/model/User.model";
import { ConfirmEmailDto, CreateUserDto, LoginDto } from "./dto/auth.dto";
import { UserRepositoryService } from "src/DB/repository/User.repository.service";
import { compareHash, generateHash } from "src/commen/security/hash.security";
import { sendEmail, subjectTypes, verifyEmailTemplate } from "src/commen/email/sendEmail";
import { sign , verify } from 'jsonwebtoken'
import { JwtService } from "@nestjs/jwt";
import { TokenService, TokenTypes } from "src/commen/service/token.service";



@Injectable()
export class AuthenticationService {
    constructor(
        private readonly UserRepositoryService: UserRepositoryService , 
        private readonly TokenService: TokenService
        // private readonly jwtService: JwtService  // token to NestJs
    ) {}

    async signup(body: CreateUserDto): Promise<any> {
        const {userName , email , password} = body;

        // const checkUser = await this.UserRepositoryService.findOne({
        //     filter: {email}
        // })
        // if(checkUser){
        //     throw new ConflictException('user already exist')
        // }

        
        await this.UserRepositoryService.checkDuplicateAccount({email})

        const otp = this.generateRandomCode() ;
        
        const user = await this.UserRepositoryService.create({
            userName ,
            email , 
            password,
            otp: `${otp}`
        })

        sendEmail({
            to: email, 
            subject: subjectTypes.confirmEmail, 
            html: verifyEmailTemplate(otp, email )
        })

        return{
            message: 'hello page signup',
            data: {
                user
            }
        }
    }

    generateRandomCode(){
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
        return otp;
    }

    async confirmEmail(body: ConfirmEmailDto){

        const {email , otp} = body;

        const user = await this.UserRepositoryService.findOne({
            filter: {email , confirmEmail: {$exists: false}}
        })

        if(!user){
            throw new NotFoundException('Not found or already confirmed')
        }

        if(!compareHash(otp , user.otp)){
            throw new BadRequestException('otp not match')
        }

        await this.UserRepositoryService.updateOne({
            filter: {_id: user._id},
            data: {
                confirmEmail: Date.now(),
                $unset: {
                    otp: 0
                },
            }
            
        })

        return{
            message: 'hello page confirmEmail',
        }
    }

    async login(body: LoginDto) : Promise<{
        message: string , data:{ accessToken : string, refreshToken : string } 
    }> {
        const {email , password} = body;

        const user = await this.UserRepositoryService.findOne({
            filter: {email}
        })

        if(!user){
            throw new NotFoundException('user not found')
        }

        if(!user.confirmEmail){
            throw new BadRequestException('please confirm check your email')
        }

        if(!compareHash(password , user.password)){
            throw new BadRequestException('password not match')    
        }

        // const token = sign(
        //     {id: user._id, },
        //     'Israa' ,
        //     { expiresIn: '1h'}
        // )

        // // NestJS JWT  
        // const token = await this.jwtService.signAsync(
        //     {id: user._id, },
        //     {secret: 'Israa' , expiresIn: '1h'}
        // )

        const accessToken = this.TokenService.sign({
            role: user.role,
            payload: {id: user._id}
        })
        const refreshToken = this.TokenService.sign({
            role: user.role,
            type: TokenTypes.refresh,
            payload: {id: user._id}
        })

        return{
            message: 'hello page login',
            data: {
                accessToken,
                refreshToken
            }
        }
    }
}