import { Component, inject } from '@angular/core';
import { UserState } from '../../states/user-state';

@Component({
  selector: 'app-show',
  imports: [],
  templateUrl: './show.html',
  styleUrl: './show.scss',
})
export class Show {

  protected userState = inject(UserState)
}
