import { Injectable } from '@nestjs/common';
import { delay, Observable, of, pipe } from 'rxjs';
import { UserDocument } from 'src/DB/model/User.model';



@Injectable()
export class UserService {

    // return watch time delay request
    profile(user: UserDocument): Observable<UserDocument> {
        return of(user).pipe(delay(100));
    }
    // profile(user: UserDocument): any {
    //     return {
    //         user
    //     }
    // }
}

