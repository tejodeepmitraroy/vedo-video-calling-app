import { Server } from 'socket.io';
// import { roomConnections } from './roomConnections';
import { roomConnections } from './roomConnections';

// const KeyByValue = (map: Map<string, string>, KeyValue: string) => {
// 	let result: string | undefined;
// 	console.log('KeyByValue', map);
// 	map.forEach((value, key) => {
// 		result = value === KeyValue ? key : result;
// 	});
// 	return result;
// };

class SocketService {
	_io: Server;
	private userIdToSocketIdMap: Map<string, string>;
	private socketIdToUserIdMap: Map<string, string>;
	private socketIdToUserMap: Map<
		string,
		{
			userId: string;
			fullName: string;
			imageUrl: string;
			emailAddress: string;
		}
	>;
	private hostSocketIdToRoomId: Map<string, string>;
	rooms: {
		[key: string]: string[];
	};

	constructor() {
		console.log('Init Socket Server');
		this._io = new Server({
			cors: {
				allowedHeaders: ['*'],
				origin: process.env.FRONTEND_URL,
			},
		});
		this.userIdToSocketIdMap = new Map();
		this.socketIdToUserIdMap = new Map();
		this.hostSocketIdToRoomId = new Map();
		this.socketIdToUserMap = new Map();
		this.rooms = {};
	}

	public initListeners() {
		const io = this.io;
		console.log('init Socket Listner.....');
		io.on('connection', (socket) => {
			console.log('New socket connected', socket.id);

			// socket.on('connectWithUser', ({ userId }: { userId: string }) => {
			// 	this.userIdToSocketIdMap.set(userId, socket.id);
			// 	this.socketIdToUserIdMap.set(socket.id, userId);

			// 	console.log(this.userIdToSocketIdMap);
			// 	console.log(this.socketIdToUserIdMap);
			// 	socket.emit('userConnected');
			// });

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
					this.socketIdToUserIdMap.set(socket.id, userId);
					this.socketIdToUserMap.set(socket.id, {
						userId,
						fullName,
						imageUrl,
						emailAddress,
					});

					socket.broadcast.emit('getOnlineUsers', {
						users: getOnlineUsers(),
					});
					socket.emit('getOnlineUsers', {
						users: getOnlineUsers(),
					});
					// // console.log(this.userIdToSocketIdMap);
					// // console.log(this.socketIdToUserIdMap);
					// console.log(this.socketIdToUserMap);
					socket.emit('userConnected');
				}
			);

			const getOnlineUsers = () => {
				const AllUsers = this.socketIdToUserMap.values();
				const valuesArray = Array.from(AllUsers);
				console.log('Online UserSs', valuesArray);
				console.log('Online UserSs2213', this.socketIdToUserMap);
				return valuesArray;
			};

			///////////////////////////////////////////////////////////////////////////////////////////////////////////////

			roomConnections(
				socket,
				io,
				this.rooms,
				this.socketIdToUserIdMap,
				this.hostSocketIdToRoomId,
				this.socketIdToUserMap
			);

			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// Disconnection Socket
			socket.on('disconnect', (reason) => {
				console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

				console.log(socket.id);

				const userId = this.socketIdToUserIdMap.get(socket.id)!;

				this.userIdToSocketIdMap.delete(userId);
				this.socketIdToUserIdMap.delete(socket.id);
				this.socketIdToUserMap.delete(socket.id);

				socket.broadcast.emit('getOnlineUsers', {
					users: getOnlineUsers(),
				});

				// console.log('After', this.userIdToSocketIdMap);
				// console.log('After', this.socketIdToUserIdMap);
				// console.log('After', this.socketIdToUserMap);

				// this.userIdToSocketIdMap.delete(userId);
				// this.socketIdToUserIdMap.delete(socket.id);
				// console.log('before hostSocketIdToRoomId', this.hostSocketIdToRoomId);
				// this.hostSocketIdToRoomId.delete(socket.id);
				// console.log('after hostSocketIdToRoomId', this.hostSocketIdToRoomId);
			});
		});
	}

	get io() {
		return this._io;
	}
}

const socketService = new SocketService();

export default socketService;
