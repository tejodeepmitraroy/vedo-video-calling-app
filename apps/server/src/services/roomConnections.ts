import { Server, Socket } from 'socket.io';

interface RoomDetails {
	[key: string]: string[];
}

type socketIdToUserIdMap = Map<string, string>;
type hostSocketIdToRoomId = Map<string, string>;
const KeyByValue = (map: Map<string, string>, KeyValue: string) => {
	let result: string | undefined;
	console.log('KeyByValue', map);
	map.forEach((value, key) => {
		result = value === KeyValue ? key : result;
	});
	return result;
};

export function roomConnections(
	socket: Socket,
	io: Server,
	rooms: RoomDetails,
	socketIdToUserIdMap: socketIdToUserIdMap,
	hostSocketIdToRoomId: hostSocketIdToRoomId
) {
	socket.on(
		'event:askToEnter',
		({
			roomId,
			username,
			profilePic,
			offer,
		}: {
			roomId: string;
			username: string | null | undefined;
			profilePic: string | null | undefined;
			offer: RTCSessionDescriptionInit;
		}) => {
			console.log('User want to ask-->', {
				roomId,
				username,
				profilePic,
				offer,
			});

			// console.log(
			//   'Host User Id--->',
			//   KeyByValue(this.hostSocketIdToRoomId, roomId)
			// );

			console.log(rooms[roomId]);

			if (rooms[roomId]) {
				if (rooms[roomId].length === 2) {
					io.to(socket.id).emit('notification:roomLimitFull');
				} else {
					const hostSocketId = KeyByValue(hostSocketIdToRoomId, roomId);
					if (hostSocketId) {
						io.to(hostSocketId!).emit('event:userWantToEnter', {
							username,
							profilePic,
							socketId: socket.id,
							offer,
						});
					} else {
						io.to(socket.id).emit('notification:hostIsNoExistInRoom');
					}
				}
			} else {
				io.to(socket.id).emit('notification:hostIsNoExistInRoom');
			}
		}
	);

	socket.on(
		'event:roomEnterPermissionDenied',
		({ socketId }: { socketId: string }) => {
			io.to(socketId).emit('notification:roomEnterPermissionDenied');
		}
	);

	socket.on(
		'event:roomEnterPermissionAccepted',
		({
			socketId,
			answer,
			hostOffer,
		}: {
			socketId: string;
			answer: RTCSessionDescriptionInit;
			hostOffer: RTCSessionDescriptionInit;
		}) => {
			console.log('Host accepted');

			io.to(socketId).emit('event:joinRoom', {
				answer,
				hostOffer,
				hostUserSocketId: socket.id,
			});

			console.log('User Joined in Room', {
				hostUserSocketId: socket.id,
			});
		}
	);

	socket.on(
		'event:joinRoom',
		({
			roomId,
			userId,
			username,
			hostUser,
		}: {
			roomId: string;
			userId: string;
			username: string;
			hostUser: boolean;
		}) => {
			console.log('Room Id', roomId);
			console.log('userId', userId);
			console.log('hostUser', hostUser);
			console.log('username', username);

			console.log('Current socket ID--->', socket.id);

			if (!rooms[roomId]) {
				rooms[roomId] = [];
			}
			socketIdToUserIdMap.set(socket.id, userId);

			if (hostUser) {
				hostSocketIdToRoomId.set(socket.id, roomId);
				console.log('Host User socket Id is add');
			}

			socket.join(roomId);
			rooms[roomId].push(socket.id);

			console.log('USER ENTERED AND ROOM DETAILS+============>>>>', rooms);

			io.to(socket.id).emit('event:enterRoom');

			io.to(roomId).emit('notification:informAllNewUserAdded', {
				userId,
				username,
				socketId: socket.id,
			});

			console.log('User Joined in Room', {
				userId,
				username,
				roomId,
				socketId: socket.id,
				roomStatus: rooms[roomId],
			});

			// if (!socketIdToEmailMap.get(userId)) {
			//   emailToSocketIdMap.set(userId, socket.id);
			//   socketIdToEmailMap.set(socket.id, userId);
			//   io.to(roomId).emit('event:UserJoined', { userId, id: socket.id });
			//   socket.join(roomId);
			//   console.log('New User Joined in Room', { userId, id: socket.id });
			//   io.to(socket.id).emit('event:joinRoom', { roomId, userId });
			// } else {
			//   io.to(roomId).emit('event:UserJoined', { userId, id: socket.id });
			//   console.log(' User Re:Joined in Room', { userId, id: socket.id });
			// }
			// emailToSocketIdMap.set(userId, socket.id);
			// socketIdToEmailMap.set(socket.id, userId);
			// io.to(roomId).emit('event:UserJoined', { userId, id: socket.id });
			// socket.join(roomId);
			// console.log('New User Joined in Room', { userId, id: socket.id });
			// io.to(socket.id).emit('event:joinRoom', { roomId, userId });
		}
	);

	socket.on(
		'event:sendAnswerHost',
		({
			hostUserSocketId,
			answer,
		}: {
			hostUserSocketId: string;
			answer: RTCSessionDescriptionInit;
		}) => {
			console.log('Host accepted', hostUserSocketId);

			io.to(hostUserSocketId).emit('event:sendAnswerHost', {
				answer,
			});

			console.log('Client Final anser send to Host', answer);
		}
	);

	socket.on(
		'event:callUser',
		({ to, offer }: { to: string; offer: RTCSessionDescriptionInit }) => {
			console.log('User CAlling', { to, offer });

			io.to(to).emit('incoming:call', {
				from: socket.id,
				offer,
			});
		}
	);

	socket.on(
		'call:accepted',
		({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }) => {
			console.log('User Accepted your Call', { to, answer });

			io.to(to).emit('call:accepted', {
				from: socket.id,
				answer,
			});
		}
	);

	socket.on(
		'event:sendIceCandidate',
		({
			remoteSocketId,
			iceCandidate,
		}: {
			remoteSocketId: string;
			iceCandidate: RTCPeerConnection;
		}) => {


			socket
				.to(remoteSocketId)
				.emit('event:sendIceCandidate', { iceCandidate });
		}
	);

	socket.on(
		'peer:nego:needed',
		({ offer, to }: { offer: RTCSessionDescriptionInit; to: string }) => {
			io.to(to).emit('peer:nego:needed', {
				from: socket.id,
				offer,
			});
		}
	);
	socket.on(
		'peer:nego:done',
		({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }) => {
			io.to(to).emit('peer:nego:final', {
				from: socket.id,
				answer,
			});
		}
	);

	socket.on(
		'event:callEnd',
		({ roomId, userId }: { roomId: string; userId: string }) => {
			io.to(roomId).emit('notification:userLeftTheRoom', { userId });
			socket.leave(roomId);
			console.log('Leaving before hostSocketIdToRoomId', hostSocketIdToRoomId);
			hostSocketIdToRoomId.delete(socket.id);
			console.log(' Leaving after hostSocketIdToRoomId', hostSocketIdToRoomId);
		}
	);

	socket.on('disconnecting', () => {
		const roomId = Array.from(socket.rooms)[1];

		const userId = socketIdToUserIdMap.get(socket.id);
		console.log('userId--->', userId);

		io.to(roomId).emit('notification:userLeftTheRoom', { userId });

		// socket.rooms.forEach((item) => {
		//   console.log('Socket Rooms---->', item);
		// });

		console.log('Socket Rooms---->', Array.from(socket.rooms)[1]);
		// the Set contains at least the socket ID
	});
}
