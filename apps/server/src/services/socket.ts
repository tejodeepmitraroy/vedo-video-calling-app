import { Server } from 'socket.io';
import { roomConnections } from './roomConnections';
// import { roomConnections } from './roomConnections';

class SocketService {
	_io: Server;
	private userIdToSocketIdMap: Map<string, string>;
	private socketIdToUserMap: Map<
		string,
		{
			socketId: string;
			userId: string;
			fullName: string;
			imageUrl: string;
			emailAddress: string;
			host: boolean;
		}
	>;
	private hostSocketIdToRoomId: Map<string, string>;
	private rooms: Map<
		string,
		{
			hostId: string;
			hostSocketId: string;
			// participants: Set<string>;
			participants: Map<
				string,
				{
					socketId: string;
					userId: string;
					fullName: string;
					imageUrl: string;
					emailAddress: string;
					host: boolean;
				}
			>;
		}
	>;

	constructor() {
		console.log('Init Socket Server');
		this._io = new Server({
			cors: {
				allowedHeaders: ['*'],
				origin: process.env.FRONTEND_URL,
			},
		});
		this.userIdToSocketIdMap = new Map();
		this.socketIdToUserMap = new Map();
		this.hostSocketIdToRoomId = new Map();
		this.rooms = new Map();
	}

	public initListeners() {
		const io = this.io;
		console.log('init Socket Listner.....');
		io.on('connection', (socket) => {
			console.log('New socket connected', socket.id);

			//////////////////////////////////////////////////////////////////////////////////////////////
			socket.on(
				'event:connectWithServer',
				({
					userId,
					fullName,
					imageUrl,
					emailAddress,
				}: {
					userId: string;
					fullName: string;
					imageUrl: string;
					emailAddress: string;
				}) => {
					this.userIdToSocketIdMap.set(userId, socket.id);
					this.socketIdToUserMap.set(socket.id, {
						socketId: socket.id,
						userId,
						fullName,
						imageUrl,
						emailAddress,
						host: false,
					});

					socket.broadcast.emit('event:getOnlineUsers', {
						users: getOnlineUsers(),
					});
					socket.emit('event:getOnlineUsers', {
						users: getOnlineUsers(),
					});

					socket.emit('event:userConnected');
				}
			);

			const getOnlineUsers = () => {
				const AllUsers = this.socketIdToUserMap.values();
				const valuesArray = Array.from(AllUsers);
				return valuesArray;
			};

			///////////////////////////////////////////////////////////////////////////////////////////////////////////////

			roomConnections(
				socket,
				io,
				this.rooms,
				this.hostSocketIdToRoomId,
				this.socketIdToUserMap
			);

			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// Disconnection Socket
			socket.on('disconnect', (reason) => {
				console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
				const userId = this.socketIdToUserMap.get(socket.id)?.userId;

				this.userIdToSocketIdMap.delete(userId!);
				this.socketIdToUserMap.delete(socket.id);

				socket.broadcast.emit('event:getOnlineUsers', {
					users: getOnlineUsers(),
				});
			});
		});
	}

	get io() {
		return this._io;
	}
}

const socketService = new SocketService();

export default socketService;
