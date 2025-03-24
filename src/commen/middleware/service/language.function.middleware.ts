import { NextFunction, Request, Response } from "express";




export const languageFunctionMiddleware = (req: Request , res: Response , next: NextFunction) =>{
    req.headers['accept-language'] = req.headers['accept-language']
    ? req.headers['accept-language']
    : process.env.APP_DEFAULT_LANGUAGE

    return next();
}