import { inject, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Service } from '@angular/core';
import { UserState } from '../states/user-state';
import { UserData } from '../pages/home/home';
import { TotalUsersState } from '../states/total-users-state';
import { resolve } from 'path';
import { rejects } from 'assert';
import { Router } from '@angular/router';

@Service()
export class SocketService {

    private platformId = inject(PLATFORM_ID);
    private socket: any;
    private userState = inject(UserState);
    private router = inject(Router);
    private usersTotalState = inject(TotalUsersState);

    /**
     * Conecta ao servidor de WebSocket.
     * Deve ser chamado apenas no cliente (browser).
     */
    connect() {
        return new Promise((resolve, reject) => {
            console.log("conectando ....");
            const { userName }: UserData = this.userState.userData();

            this.socket = io({
                path: '/socket.io/',
                transports: ['polling', 'websocket'],
                query: { userName }
            });

            this.socket.on('connect', () => {
                console.log('✅ Conectado ao WebSocket! ID:');
                resolve(true);
            });

            this.socket.on('disconnect', (reason: any) => {
                console.warn('❌ Desconectado do WebSocket:', reason);
                resolve(false);
            });


            this.socket.on('partida-iniciada', (data: any) => {
   
                this.userState.userData.update((el) => {
                    el.isAmong = data.impostor
                    el.userId = data.palavra
                    return el;
                })

                this.router.navigate(["show"])
            });


            this.socket.on('lista-atualizada', (userNames: any) => {
                console.log(userNames);
                this.usersTotalState.userData.set(userNames);
            });

        })
    }

    start(qtde: any) {
        this.socket.emit("start", qtde);
    }
}





