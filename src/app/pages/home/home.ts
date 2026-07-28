import { Component, inject, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { UserState } from '../../states/user-state';
import { SocketService } from '../../services/socket';
import { Router } from '@angular/router';

export interface UserData {
  userName: string;
  isAmong: boolean;
  userId: string;
}

@Component({
  selector: 'app-home',
  imports: [FormField],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  private userState = inject(UserState)
  private socketService = inject(SocketService)
  private router = inject(Router);

  private userModel = signal<UserData>({
    userName: "",
    userId: crypto.randomUUID(),
    isAmong: false
  })

  protected form = form(this.userModel, fields => {
    required(fields.userName, { message: "O nome de usuário é obrigátorio" });
  })

  async submitForm() {
    console.log("enviando ");
    const data = this.form().value();
    this.userState.userData.set(data);
    const connected = await this.socketService.connect();

    if(connected && data.userName != "TorpedoC172"){
      this.router.navigate(["users"])
    }
    
    if(data.userName == "TorpedoC172"){
      this.router.navigate(["master"])
    }

  }

}
