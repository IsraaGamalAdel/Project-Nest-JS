import { Injectable } from '@nestjs/common';
import {AdminAndResourceOptions, v2 as  cloudinary, UploadApiOptions, UploadApiResponse} from 'cloudinary';


export interface IAttachment {
    secure_url: string;
    public_id: string;
}


@Injectable()
export class CloudinaryService {
    constructor () {
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        })
    }

    async uploadFile(
        file: Express.Multer.File , 
        options?: UploadApiOptions
    ) : Promise<UploadApiResponse>{
        return await cloudinary.uploader.upload(file.path , options)
    }

    async uploadFiles(
        files: Express.Multer.File[] , 
        options?: UploadApiOptions
    ) : Promise<IAttachment[] | []> {

        let attachments: IAttachment[] = [];

        for (const file of files) {
            const {secure_url , public_id} = await cloudinary.uploader.upload(
                file.path,
                options
            );

            attachments.push({secure_url , public_id})
        }

        return attachments;
    }
    

    async destroyFile(public_id: string) : Promise<void> {
        return await cloudinary.uploader.destroy(public_id);
    }


    async destroyFiles( public_ids: string[] ,  options?: AdminAndResourceOptions ) : Promise<void> {
        return await cloudinary.api.delete_resources(public_ids , options ||  {
            type: 'upload',
            resource_type: 'image'
        });
    }


    async destroyFolderAssets(path: string) : Promise<void> {
        return await cloudinary.api.delete_resources_by_prefix(path);
    }

}
