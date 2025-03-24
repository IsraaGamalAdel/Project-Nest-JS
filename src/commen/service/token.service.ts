import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserRepositoryService } from './../../DB/repository/User.repository.service';
import { RoleTypes, UserDocument } from "src/DB/model/User.model";




export interface ITokenPayload extends JwtPayload {
    id: Types.ObjectId
}


export enum TokenTypes {
    access = 'access',
    refresh = 'refresh'
}

export enum BearerTypes {
    Bearer = 'Bearer',
    System = 'System'
}

interface IGenerateToken {
    role?: RoleTypes,
    type?: TokenTypes,
    payload: ITokenPayload,
    expiresIn?: number
}

@Injectable()
export class TokenService{
    constructor (
        private UserRepositoryService: UserRepositoryService,
        private readonly jwt: JwtService,
    ){}

    sign({
        role = RoleTypes.user,
        type = TokenTypes.access,
        payload,
        expiresIn = parseInt(process.env.USER_EXPIREINTOKEN || ''),
    } : IGenerateToken ) : string {
        const { accessSignature , refreshSignature } = this.getSignature(role);

        const token = this.jwt.sign(
            payload , 
            {
                secret: type === TokenTypes.access ? accessSignature : refreshSignature,
                expiresIn:type === TokenTypes.access 
                ? expiresIn 
                : parseInt(process.env.EXPIREINTOKEN_REFRESH || '')
            }
        )
        return token
    }

    private getSignature ( role: RoleTypes) : {
        accessSignature : string,
        refreshSignature : string
    } {
        let accessSignature : string;
        let refreshSignature : string;

        switch (role) {
            case RoleTypes.admin:
                accessSignature = process.env.ADMIN_ACCESS_TOKEN as string;
                refreshSignature = process.env.ADMIN_REFRESH_TOKEN as string;
                break;
            default:
                accessSignature = process.env.USER_ACCESS_TOKEN as string;
                refreshSignature = process.env.USER_REFRESH_TOKEN as string;
                break;
        }

        return {
            accessSignature,
            refreshSignature
        }
    }

    async verify({
        authorization,
        type = TokenTypes.access
    } : {
        authorization: string,
        type?: TokenTypes
    }) : Promise<UserDocument>{

        try {
            const [ bearer , token ] = authorization.split(' ') || [];

            if(!bearer || !token){
                throw new BadRequestException('Missing token');
            }
    
            const { accessSignature , refreshSignature } = this.getSignature(
                bearer == BearerTypes.System ? RoleTypes.admin : RoleTypes.user
            );
    
    
            const decoded = this.jwt.verify( token , { 
                secret: type == TokenTypes.access ? accessSignature : refreshSignature 
            } );
    
            if(!decoded?.id) {
                throw new UnauthorizedException('Invalid token');
            }
    
            const user = await this.UserRepositoryService.findOne({
                filter: {_id: decoded.id}
            })
    
            if (!user) {
                throw new NotFoundException('User not found');
            }

            if(user.changeCredentialTime?.getTime() >= decoded.iat * 1000){
                throw new BadRequestException('expired Token to credential , please login again');
            }
    
            return user;
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }
}

