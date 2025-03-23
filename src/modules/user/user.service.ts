import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/DB/model/User.model';

@Injectable()
export class UserService {
    profile(user: UserDocument): any {
        return {
            user
        }
    }
}

