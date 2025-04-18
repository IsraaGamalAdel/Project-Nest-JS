import { BadRequestException } from "@nestjs/common"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import { existsSync, mkdirSync } from "fs"
import { diskStorage } from "multer"
import { resolve } from "path"



export const validationFile = {
    image: ['image/jpeg' , 'image/png' ,],
    file: ['application/json' , 'plain/text', 'application/pdf'],
}


export const CloudMulterOptions = ({
    fileValidators = [],
    fileSize = 1024 * 50 ,
} : {
    fileValidators?: string[],
    fileSize?: number
}): MulterOptions => {

    return {
        storage: diskStorage({}) ,
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