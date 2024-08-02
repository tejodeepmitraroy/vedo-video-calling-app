import { Server, Socket } from 'socket.io';
// import prisma from '../lib/prismaClient';

// type socketIdToUserIdMap = Map<string, string>;
type hostSocketIdToRoomId = Map<string, string>;
type socketIdToUserMap = Map<
	string,
	{
		userId: string;
		fullName: string;
		imageUrl: string;
		emailAddress: string;
	}
>;
type rooms = Map<
	string,
	{
		hostId: string;
		hostSocketId: string;
		participants: Set<unknown>;
	}
>;

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
	rooms: rooms,
	// socketIdToUserIdMap: socketIdToUserIdMap,
	hostSocketIdToRoomId: hostSocketIdToRoomId,
	socketIdToUserMap: socketIdToUserMap
) {
	socket.on(
		'event:checkPreviouslyJoinedRoom',
		({ roomId, hostUser }: { roomId: string; hostUser: boolean }) => {
			const usersInRoom = rooms.get(roomId)?.participants;
			const PreviouslyJoin = usersInRoom?.has(
				socketIdToUserMap.get(socket.id)?.userId
			);

			console.log(hostUser, PreviouslyJoin);

			if (PreviouslyJoin || hostUser) {
				console.log('Host Can Join');
				socket.emit('event:directlyCanJoin', { directlyCanJoin: true });
			} else {
				console.log('Perviously Not Joined so ask To Join Host');
				socket.emit('event:directlyCanJoin', { directlyCanJoin: false });
			}
		}
	);

	socket.on(
		'event:askToJoin',
		({
			roomId,
			offer,
		}: {
			roomId: string;
			offer: RTCSessionDescriptionInit;
		}) => {
			console.log('User want to ask-->', {
				roomId,
				username: socketIdToUserMap.get(socket.id)?.fullName,
				profilePic: socketIdToUserMap.get(socket.id)?.imageUrl,
				offer,
			});

			// console.log(
			//   'Host User Id--->',
			//   KeyByValue(this.hostSocketIdToRoomId, roomId)
			// );

			// console.log(rooms[roomId]);
			console.log(rooms);

			// if (rooms[roomId]) {
			// 	if (rooms[roomId].length === 2) {
			// 		io.to(socket.id).emit('notification:roomLimitFull');
			// 	} else {
			// 		const hostSocketId = KeyByValue(hostSocketIdToRoomId, roomId);
			// 		if (hostSocketId) {
			// 			io.to(hostSocketId!).emit('event:userWantToEnter', {
			// 				username: socketIdToUserMap.get(socket.id)?.fullName,
			// 				profilePic: socketIdToUserMap.get(socket.id)?.imageUrl,
			// 				socketId: socket.id,
			// 				offer,
			// 			});
			// 		} else {
			// 			io.to(socket.id).emit('notification:hostIsNoExistInRoom');
			// 		}
			// 	}
			// } else {
			// 	io.to(socket.id).emit('notification:hostIsNoExistInRoom');
			// }

			if (rooms.get(roomId)) {
				if (rooms.size === 2) {
					io.to(socket.id).emit('notification:roomLimitFull');
				} else {
					const hostSocketId = KeyByValue(hostSocketIdToRoomId, roomId);
					if (hostSocketId) {
						io.to(hostSocketId!).emit('event:userWantToEnter', {
							username: socketIdToUserMap.get(socket.id)?.fullName,
							profilePic: socketIdToUserMap.get(socket.id)?.imageUrl,
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
		async ({ roomId, hostUser }: { roomId: string; hostUser: boolean }) => {
			// console.log('Room Id', roomId);
			// console.log('userId', socketIdToUserMap.get(socket.id)?.userId);
			// console.log('hostUser', hostUser);
			// console.log('username', socketIdToUserMap.get(socket.id)?.fullName);

			// console.log('Current socket ID--->', socket.id);

			// if (!rooms[roomId]) {
			// 	rooms[roomId] = [];
			// }

			if (!rooms.get(roomId) && hostUser) {
				hostSocketIdToRoomId.set(socket.id, roomId);
				// const hostUserId = socketIdToUserIdMap.get(socket.id);
				const hostUserId = socketIdToUserMap.get(socket.id)?.userId;

				// const usersArray = new Set();
				const roomDetails = {
					hostId: hostUserId!,
					hostSocketId: socket.id,
					participants: new Set(),
				};
				console.log('Host User socket Id is add');
				rooms.set(roomId, roomDetails);
			}

			// if (hostUser) {

			// 	hostSocketIdToRoomId.set(socket.id, roomId);
			// 	const roomDetails = rooms.get(roomId);
			// 	console.log('Host User socket Id is add');
			// }

			socket.join(roomId);

			// rooms[roomId].push(socket.id);
			const roomInUsers = rooms.get(roomId)?.participants;
			// roomInUsers?.add(socketIdToUserIdMap.get(socket.id));
			roomInUsers?.add(socketIdToUserMap.get(socket.id)?.userId);
			// rooms.set(roomId).push(socket.id);

			// const meeting = await prisma.participantsInRoom.upsert({
			// 	where: {
			// 		user_id_room_id: {
			// 			room_id: roomId,
			// 			user_id: socketIdToUserMap.get(socket.id)!.userId,
			// 		},
			// 	},
			// 	update: {},
			// 	create: {
			// 		room_id: roomId,
			// 		user_id: socketIdToUserMap.get(socket.id)!.userId,
			// 	},
			// });

			// console.log('MEETING DETails=========>', meeting);

			console.log('USER ENTERED AND ROOM DETAILS+============>>>>', rooms);

			socket.emit('event:enterRoom');

			io.to(roomId).emit('notification:informAllNewUserAdded', {
				userId: socketIdToUserMap.get(socket.id)?.userId,
				username: socketIdToUserMap.get(socket.id)?.fullName,
				socketId: socket.id,
			});

			console.log('User Joined in Room', {
				userId: socketIdToUserMap.get(socket.id)?.userId,
				username: socketIdToUserMap.get(socket.id)?.fullName,
				roomId,
				socketId: socket.id,
				hostSocketIdToRoomId: hostSocketIdToRoomId.get(socket.id),
				roomStatus: rooms.get(roomId),
			});
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
		'event:callEnd',
		({ roomId }: { roomId: string; userId: string }) => {
			socket.broadcast.emit('notification:userLeftTheRoom', {
				// userId: socketIdToUserIdMap.get(socket.id),
				userId: socketIdToUserMap.get(socket.id)?.userId,
			});
			socket.leave(roomId);
			console.log('Leaving before hostSocketIdToRoomId', hostSocketIdToRoomId);
			hostSocketIdToRoomId.delete(socket.id);
			console.log(' Leaving after hostSocketIdToRoomId', hostSocketIdToRoomId);
		}
	);

	socket.on('event:endRoom', ({ roomId }: { roomId: string }) => {
		socket.broadcast.emit('event:removeEveryoneFromRoom');
		socket.emit('event:removeEveryoneFromRoom');
		// delete rooms[roomId];
		rooms.delete(roomId);
		io.socketsLeave(roomId);
	});

	socket.on('disconnecting', () => {
		const roomId = Array.from(socket.rooms)[1];
		// const roomInUsers = rooms.get(roomId);
		// roomInUsers?.delete(socket.id);

		// const userId = socketIdToUserIdMap.get(socket.id);
		const userId = socketIdToUserMap.get(socket.id)?.userId;
		console.log('userId--->', userId);

		io.to(roomId).emit('notification:userLeftTheRoom', { userId });

		// socket.rooms.forEach((item) => {
		//   console.log('Socket Rooms---->', item);
		// });

		console.log('Socket Rooms---->', Array.from(socket.rooms)[1]);
		// the Set contains at least the socket ID
	});
}
