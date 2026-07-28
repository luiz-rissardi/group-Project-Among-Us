import { Component, effect, inject } from '@angular/core';
import { TotalUsersState } from '../../states/total-users-state';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {

  protected userList = inject(TotalUsersState);

  constructor(){
    effect(()=>{
      console.log(this.userList.userData());
    })
  }
}
