'use client';
import { io, Socket } from 'socket.io-client';

import {
	createContext,
	FC,
	useContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';

interface SocketProviderProps {
	children: ReactNode;
}

interface ISocketContext {
	joinRoom: (roomId: string, email: string) => any;
	socket: Socket | undefined;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
	const state = useContext(SocketContext);
	if (!state) throw new Error('state is undefined');
	return state;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket>();
	useEffect(() => {
		const _socket = io('http://localhost:8000');
		setSocket(_socket);
		return () => {
			_socket.disconnect();
		};
	}, []);

	const joinRoom: ISocketContext['joinRoom'] = useCallback(
		(roomId, email) => {
			console.log('send Message', roomId);
			if (socket) {
				socket.emit('event:joinRoom', { roomId, email });

				socket.on(
					'event:joinRoom',
					({ roomId, email }: { roomId: string; email: string }) =>
						console.log(`Came form BE RoomId:${roomId}, Email ${email}`)
				);
			}
		},
		[socket]
	);

	return (
		<SocketContext.Provider value={{ joinRoom, socket }}>
			{children}
		</SocketContext.Provider>
	);
};
