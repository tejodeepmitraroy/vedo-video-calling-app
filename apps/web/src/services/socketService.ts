import { io, Socket } from 'socket.io-client';

class SocketService {
	socket: Socket;
	constructor(url: string) {
		this.socket = io(url, 
            // {
			// transports: ['websocket'],
		// }
    );
	}

	connect(): void {
		this.socket.connect();
	}

	disconnect(): void {
		this.socket.disconnect();
	}

	on(event: string, callback: (...args: any[]) => void): void {
		this.socket.on(event, callback);
	}
	off(event: string, callback?: (...args: any[]) => void): void {
		this.socket.off(event, callback);
	}

	emit(event: string, data?: any): void {
		this.socket.emit(event, data);
	}
}

// const socketService = new SocketService('http://localhost:8000');

// export default socketService;
