'use client';
import { io, Socket } from 'socket.io-client';

import {
	createContext,
	useContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useUser } from '@clerk/nextjs';

interface ISocketContext {
	socket: Socket | undefined;
	socketOn: (event: string, callback: (...args: any[]) => void) => any;
	socketOff: (event: string, callback?: (...args: any[]) => void) => any;
	socketEmit: (event: string, data?: any) => any;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
	const state = useContext(SocketContext);
	if (!state) throw new Error('state is undefined');
	return state;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const { user, isSignedIn } = useUser();
	const [socket, setSocket] = useState<Socket>();
	useEffect(() => {
		if (isSignedIn) {
			let _socket;
			_socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_SERVER_URL!);

			setSocket(_socket);
			return () => {
				_socket.disconnect();
			};
		}

		// socketService.connect();

		// return () => {
		// 	socketService.disconnect();
		// };
	}, [isSignedIn]);

	const socketOn: ISocketContext['socketOn'] = useCallback(
		(event: string, callback: (...args: any) => void) => {
			if (socket) {
				// console.log('Socket is On', event);
				// console.log('Socket is On CB', callback);
				socket.on(event, callback);
			}
		},
		[socket]
	);

	const socketOff: ISocketContext['socketOff'] = useCallback(
		(event: string, callback?: (...args: any[]) => void) => {
			if (socket) {
				// console.log('Socket is Off', event);
				// console.log('Socket is Off CB', callback);
				socket.off(event, callback);
			}
		},
		[socket]
	);

	const socketEmit: ISocketContext['socketEmit'] = useCallback(
		(event: string, data?: any) => {
			if (socket) {
				// console.log('Socket is Emit', event);
				// console.log('Socket is On Emit', data);
				socket.emit(event, data);
			}
		},
		[socket]
	);

	return (
		<SocketContext.Provider value={{ socket, socketOn, socketOff, socketEmit }}>
			{children}
		</SocketContext.Provider>
	);
};
