import { Service, signal } from '@angular/core';
import { UserData } from '../pages/home/home';

@Service()
export class TotalUsersState {

    userData = signal<Array<any>>([])
}
