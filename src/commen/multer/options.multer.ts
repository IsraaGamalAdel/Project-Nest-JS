import { BadRequestException } from "@nestjs/common"
import { existsSync, mkdirSync } from "fs"
import { diskStorage } from "multer"
import { resolve } from "path"



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
            destination: (req , file , cd) => {
                let fullURL = resolve(`./${baseURL}/${req['user']._id}`)

                if (!existsSync(fullURL)) {
                    mkdirSync(fullURL , { recursive: true });
                }

                cd(null , fullURL )
            },
            filename: (req , file , cd) => {
                const fileName = Date.now() + '_' +  file.originalname ; 
                file['finalPath'] = `${baseURL}/${req['user']._id}/${fileName}`
                cd(null , fileName)
            }
        }) ,
        fileFilter: (req , file , cd) => {
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