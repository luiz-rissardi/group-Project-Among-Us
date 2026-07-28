import { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';


const db: Array<any> = []
const santosCatolicos = [
    'São Francisco de Assis',
    'São Pedro',
    'São Paulo',
    'São Judas Tadeu',
    'Santa Teresinha do Menino Jesus',
    'São José',
    'São Bento',
    'São João Batista',
    'São Jorge',
    'jesus cristo',
    'maria mãe de Deus',
    'santa luiza',
    'são joao apostolo',
    'joao paulo segundo',
    'carlo accutis',
    'são miguel',
];

export class SocketHandler {
    private static io: SocketIOServer | null = null;

    static setup(server: HttpServer): any {
        if (this.io) return this.io;

        this.io = new SocketIOServer(server, {
            path: '/socket.io/',
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            transports: ['polling', 'websocket'],
        });


        this.io.on('connection', (socket: Socket) => {
            const userName = socket.handshake.query["userName"] as string;
            db.push(userName);
            console.log('✅ Cliente Socket.IO conectado! ID:', userName);

            socket.join(userName);
            socket.join("impostor");
            this.io?.to("impostor").emit("lista-atualizada", db);

            socket.on('disconnect', () => {
                console.log('❌ Cliente desconectado:', socket.id);
                const index = db.indexOf(userName);
                if (index !== -1) {
                    db.splice(index, 1);
                }

                // Notifica quem sobrou na sala
                SocketHandler.io?.to("impostor").emit("lista-atualizada", db);
            });


            socket.on("start", (qtdeImpostor: number) => {



                // 1. Sorteia uma palavra aleatória (Santo da Igreja Católica)
                const palavraSorteada = santosCatolicos[Math.floor(Math.random() * santosCatolicos.length)];

                // 2. Sorteia os impostores aleatórios do array db sem repetir
                const dbCopia = [...db];
                const impostoresSorteados: string[] = [];

                // Limita a quantidade de impostores para não ultrapassar o total de jogadores
                const limiteImpostores = Math.min(qtdeImpostor, dbCopia.length - 1 || 1);

                while (impostoresSorteados.length < limiteImpostores && dbCopia.length > 0) {
                    const indexAleatorio = Math.floor(Math.random() * dbCopia.length);
                    const [impostorSorteado] = dbCopia.splice(indexAleatorio, 1);
                    impostoresSorteados.push(impostorSorteado);
                }

                console.log('🎮 Partida Iniciada!');
                console.log('👑 Palavra Secreta:', palavraSorteada);
                console.log('🕵️ Impostores:', impostoresSorteados);

                // 3. Notifica TODOS na sala "impostor" com os dados do jogo

                const semImpostor = db.filter(el => {
                    return !impostoresSorteados.includes(el);
                })

                for (let userName of semImpostor) {
                    this.io?.to(userName).emit('partida-iniciada', {
                        palavra: palavraSorteada,
                        impostor: false
                    });
                }

                for (let userName of impostoresSorteados) {
                    this.io?.to(userName).emit('partida-iniciada', {
                        impostor: true,
                    });
                }
            })
        });

    }


}