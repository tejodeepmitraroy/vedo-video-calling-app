import { Server } from 'socket.io';
// import { roomConnections } from './roomConnections';
import { roomConnections2 } from './roomConnections2';
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
				'connectWithUser',
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

					socket.broadcast.emit('getOnlineUsers', {
						users: getOnlineUsers(),
					});
					socket.emit('getOnlineUsers', {
						users: getOnlineUsers(),
					});

					// console.log('connectWithUser',this.socketIdToUserMap);
					socket.emit('userConnected');
				}
			);

			const getOnlineUsers = () => {
				const AllUsers = this.socketIdToUserMap.values();
				const valuesArray = Array.from(AllUsers);

				// console.log('Online UserSs', valuesArray);
				// console.log('Online UserSs2213', this.socketIdToUserMap);
				return valuesArray;
			};

			///////////////////////////////////////////////////////////////////////////////////////////////////////////////

			roomConnections2(
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

				console.log(socket.id);

				// const userId = this.socketIdToUserIdMap.get(socket.id)!;
				const userId = this.socketIdToUserMap.get(socket.id)?.userId;

				this.userIdToSocketIdMap.delete(userId!);
				// this.socketIdToUserIdMap.delete(socket.id);
				this.socketIdToUserMap.delete(socket.id);

				socket.broadcast.emit('getOnlineUsers', {
					users: getOnlineUsers(),
				});

				// console.log('After', this.userIdToSocketIdMap);
				// console.log('After', this.socketIdToUserIdMap);
				// console.log('After', this.socketIdToUserMap);
			});
		});
	}

	get io() {
		return this._io;
	}
}

const socketService = new SocketService();

export default socketService;
