import { Injectable } from "@nestjs/common";

@Injectable()


export class AuthenticationService {
    constructor() {}

    signup(body: any): { message: string; data: any} {
        return{
            message: 'hello page signup',
            data: {
                body
            }
        }
    }
}