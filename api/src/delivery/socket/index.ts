import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { OrderId } from '../../modules/orders/core/domain/Order';

export class SocketManager {
    private io: Server;

    constructor(private server: HttpServer) {
        this.io = new Server(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        this.setupSocketEvents();
    }

    public emitTo(room: string, event: string, data: any): void {
        this.io.to(room).emit(event, data);
    }

    private setupSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            socket.on('join-order', (orderId: OrderId) => {
                socket.join(`order-${orderId}`);
            });

            socket.on('join-orders', () => {
                socket.join('orders');
            });
        });
    }
}