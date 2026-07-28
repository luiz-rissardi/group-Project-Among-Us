import { Service, signal } from '@angular/core';
import { UserData } from '../pages/home/home';

@Service()
export class UserState {

    userData = signal<UserData>({
        isAmong:false,
        userId:crypto.randomUUID(),
        userName:""
    })
}
