import { BadRequestException } from "@nestjs/common"
import { Request } from "express"
import { existsSync, mkdirSync } from "fs"
import { diskStorage } from "multer"
import { resolve } from "path"



export const validationFile = {
    image: ['image/jpeg' , 'image/png' ,],
    file: ['application/json' , 'plain/text', 'application/pdf'],
}


export const MulterOptions = ({
    path = 'public',
    fileValidators = [],
    fileSize = 1024 * 50 ,
} : {
    path?: string,
    fileValidators?: string[],
    fileSize?: number
}) => {

    let baseURL = `uploads/${path}`
    

    return {
        storage: diskStorage({
            destination: (req:Request , file:Express.Multer.File , cd:Function) => {
                let fullURL = resolve(`./${baseURL}/${req['user']._id}`)

                if (!existsSync(fullURL)) {
                    mkdirSync(fullURL , { recursive: true });
                }

                cd(null , fullURL )
            },
            filename: (req:Request , file:Express.Multer.File , cd:Function) => {
                const fileName = Date.now() + '_' +  file.originalname ; 
                file['finalPath'] = `${baseURL}/${req['user']._id}/${fileName}`
                cd(null , fileName)
            }
        }) ,
        fileFilter: (req:Request , file:Express.Multer.File , cd:Function) => {
            // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //     cd(null , true)
            // } else {
            //     return cd(new BadRequestException('invalid file type') , false)
            // }
    
            if (!fileValidators?.includes(file.mimetype) ) {
                return cd(new BadRequestException('invalid file type') , false)
            } else {
                cd(null , true)
            }
    
        },
        limits: {
            fileSize ,
        },
    }
}