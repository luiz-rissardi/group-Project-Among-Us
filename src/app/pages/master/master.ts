import { Component, inject, signal } from '@angular/core';
import { SocketService } from '../../services/socket';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-master',
  imports: [FormField],
  templateUrl: './master.html',
  styleUrl: './master.scss',
})
export class Master {

  private socketService = inject(SocketService);


  formT = form(signal({
    qtde:0
  }));


  protected start(){
    const qtde = this.formT().value().qtde;
    this.socketService.start(qtde)
  }
}
