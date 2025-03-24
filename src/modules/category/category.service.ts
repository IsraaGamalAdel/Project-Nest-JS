import { Injectable } from '@nestjs/common';
import { log } from 'console';




@Injectable()
export class CategoryService {
    create( file: Express.Multer.File , body: any ) {
        log({file , body});

        
        return "hello Category" 
    }
}
