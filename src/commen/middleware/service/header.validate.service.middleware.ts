import { Injectable, NestMiddleware } from "@nestjs/common";
import { log } from "console";
import { NextFunction, Request, Response } from "express";



@Injectable()
export class HeaderValidateServiceMiddleware implements NestMiddleware {
    
    constructor() {}

    use(req: Request , res: Response , next: NextFunction) {
        log("Hi middleware")
        if (!req.headers.authorization || req.headers.authorization.split(' ').length != 2) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        return next();
    }
}