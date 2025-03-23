import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserRepositoryService } from './../../DB/repository/User.repository.service';
import { UserDocument } from "src/DB/model/User.model";



export interface ITokenPayload extends JwtPayload {
    id: Types.ObjectId
}


@Injectable()
export class TokenService{
    constructor (
        private UserRepositoryService: UserRepositoryService,
        private readonly jwt: JwtService,
    ){}

    sign({
        payload,
        secret = process.env.USER_ACCESS_TOKEN,
        expiresIn = parseInt(process.env.USER_EXPIREINTOKEN as string)
    } : {
        payload: ITokenPayload,
        secret?: string,
        expiresIn?: number
    }) {
        const token = this.jwt.sign(
            payload , 
            {
                secret ,
                expiresIn
            }
        )
        return token
    }

    async verify({
        authorization,
        secret = process.env.USER_ACCESS_TOKEN,
    } : {
        authorization: string,
        secret?: string
    }) : Promise<UserDocument>{
        const [ bearer , token ] = authorization.split(' ') || [];

        if(!bearer || !token){
            throw new BadRequestException('Missing token');
        }

        const decoded = this.jwt.verify( token , { secret });

        if(!decoded?.id) {
            throw new UnauthorizedException('Invalid token');
        }

        const user = await this.UserRepositoryService.findOne({
            filter: {_id: decoded.id}
        })

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}