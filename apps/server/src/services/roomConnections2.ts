import { Server, Socket } from 'socket.io';
import prisma from '../lib/prismaClient';

type hostSocketIdToRoomId = Map<string, string>;
type socketIdToUserMap = Map<
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

type rooms = Map<
	string,
	{
		hostId: string;
		hostSocketId: string;
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

export function roomConnections2(
	socket: Socket,
	io: Server,
	rooms: rooms,
	hostSocketIdToRoomId: hostSocketIdToRoomId,
	socketIdToUserMap: socketIdToUserMap
) {
	socket.on(
		'event:checkPreviouslyJoinedRoom',
		({ roomId, hostUser }: { roomId: string; hostUser: boolean }) => {
			const usersInRoom = rooms.get(roomId)?.participants;
			const PreviouslyJoin = usersInRoom?.has(
				socketIdToUserMap.get(socket.id)!.userId
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
		({ roomId }: { roomId: string; offer: RTCSessionDescriptionInit }) => {
			console.log('User want to ask-->', {
				roomId,
				username: socketIdToUserMap.get(socket.id)?.fullName,
				profilePic: socketIdToUserMap.get(socket.id)?.imageUrl,
			});

			console.log(rooms);

			if (rooms.get(roomId)) {
				if (rooms.get(roomId)?.participants.size === 4) {
					io.to(socket.id).emit('notification:roomLimitFull');
				} else {
					// const hostSocketId = KeyByValue(hostSocketIdToRoomId, roomId);
					const hostSocketId = rooms.get(roomId)?.hostSocketId;

					if (hostSocketId) {
						io.to(hostSocketId!).emit('event:userWantToEnter', {
							username: socketIdToUserMap.get(socket.id)?.fullName,
							profilePic: socketIdToUserMap.get(socket.id)?.imageUrl,
							socketId: socket.id,
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
			if (!rooms.has(roomId) && hostUser) {
				hostSocketIdToRoomId.set(socket.id, roomId);
				const hostUserId = socketIdToUserMap.get(socket.id)?.userId;

				const roomDetails = {
					hostId: hostUserId!,
					hostSocketId: socket.id,

					participants: new Map<
						string,
						{
							socketId: string;
							userId: string;
							fullName: string;
							imageUrl: string;
							emailAddress: string;
							host: boolean;
						}
					>(),
				};
				console.log('Host User socket Id is add');
				rooms.set(roomId, roomDetails);
			}

			if (rooms.has(roomId) && hostUser) {
				console.log('Participents=========>', rooms.get(roomId));

				const updateUser = socketIdToUserMap.get(socket.id)!;

				socketIdToUserMap.set(socket.id, { ...updateUser, host: true });

				const hostUserId = socketIdToUserMap.get(socket.id)?.userId;
				const roomDetails = {
					hostId: hostUserId!,
					hostSocketId: socket.id,
					participants: rooms.get(roomId)!.participants,
				};
				rooms.set(roomId, roomDetails);
			}

			socket.join(roomId);

			const roomInUsers = rooms.get(roomId)!.participants;

			roomInUsers.set(socket.id, socketIdToUserMap.get(socket.id)!);

			const meeting = await prisma.participantsInRoom.upsert({
				where: {
					user_id_room_id: {
						room_id: roomId,
						user_id: socketIdToUserMap.get(socket.id)!.userId,
					},
				},
				update: {},
				create: {
					room_id: roomId,
					user_id: socketIdToUserMap.get(socket.id)!.userId,
				},
			});

			console.log('MEETING DETails=========>', meeting);

			console.log('USER ENTERED AND ROOM DETAILS+============>>>>', rooms);

			// const participants: any[] = [];

			// rooms.get(roomId)?.participants.forEach((socketId,) => {
			// 	console.log('participants===>', socketIdToUserMap.get(socketId)!);
			// 	participants.push(socketIdToUserMap.get(socketId)!);

			// });

			socket.emit('event:enterRoom');

			io.to(roomId).emit('notification:informAllNewUserAdded', {
				userId: socketIdToUserMap.get(socket.id)?.userId,
				username: socketIdToUserMap.get(socket.id)?.fullName,
				socketId: socket.id,
			});

			const AllUsers = rooms.get(roomId)?.participants.values();
			const participantsArray = Array.from(AllUsers!);

			io.to(roomId).emit('event:new-user-connected', {
				participants: participantsArray,
			});

			io.to(roomId).emit('user-connected', {
				userSocketId: socket.id,
			});

			// participantsArray.map((item) => {
			// 	io.to(roomId).emit('user-connected', {
			// 		userSocketId: item.socketId,
			// 	});
			// });

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

	// Relay offers and answers
	socket.on(
		'event:sendOffer',
		({
			offer,
			userSocketId,
		}: {
			offer: RTCSessionDescriptionInit;
			userSocketId: string;
		}) => {
			socket.to(userSocketId).emit('offer', { offer, socketId: socket.id });
		}
	);

	socket.on(
		'event:sendAnswer',
		({
			answer,
			socketId,
		}: {
			answer: RTCSessionDescriptionInit;
			socketId: string;
		}) => {
			io.to(socketId).emit('answer', { answer, userSocketId: socket.id });
		}
	);

	socket.on('ice-candidate', ({ iceCandidate }) => {
		socket.broadcast.emit('ice-candidate', {
			iceCandidate,
			socketId: socket.id,
		});
	});

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

			// io.to(hostUserSocketId).emit('event:sendAnswerHost', {
			// 	answer,
			// });
			socket.broadcast.emit('event:sendAnswerHost', {
				answer,
			});

			console.log('Client Final answer send to Host', answer);
		}
	);

	socket.on(
		'event:sendIceCandidate',
		({
			iceCandidate,
		}: {
			userSocketId: string;
			iceCandidate: RTCPeerConnection;
		}) => {
			socket.broadcast.emit('event:addIceCandidate', {
				iceCandidate,
				socketId: socket.id,
			});
		}
	);

	socket.on(
		'event:callEnd',
		({ roomId }: { roomId: string; userId: string }) => {
			const roomDetails = rooms.get(roomId);
			const roomParticipants = roomDetails?.participants;

			if (roomDetails?.hostSocketId === socket.id) {
				roomDetails.hostId = '';
				roomDetails.hostSocketId = '';
				roomParticipants?.delete(socketIdToUserMap.get(socket.id)!.userId);
			}

			if (roomParticipants?.size === 1) {
				rooms.delete(roomId);
			}

			io.to(roomId).emit('notification:userLeftTheRoom', {
				userId: socketIdToUserMap.get(socket.id)?.userId,
			});
			socket.leave(roomId);
			console.log('Leaving after Room Details', roomDetails);
		}
	);

	socket.on('event:endRoom', ({ roomId }: { roomId: string }) => {
		const roomDetails = rooms.get(roomId);
		if (roomDetails?.hostSocketId === socket.id) {
			io.to(roomId).emit('event:removeEveryoneFromRoom');
			rooms.delete(roomId);
			io.socketsLeave(roomId);
		}
	});

	socket.on('disconnecting', () => {
		const roomId = Array.from(socket.rooms)[1];

		const roomDetails = rooms.get(roomId);
		const roomParticipants = roomDetails?.participants;

		if (roomDetails?.hostSocketId === socket.id) {
			roomDetails.hostId = '';
			roomDetails.hostSocketId = '';
			roomParticipants?.delete(socket.id);
		}

		const AllUsers = roomParticipants?.values();

		if (AllUsers) {
			const participantsArray = Array.from(AllUsers);
			socket.to(roomId).emit('event:user-disconnected', {
				participants: participantsArray,
			});
		} else {
			socket.to(roomId).emit('event:user-disconnected', {
				participants: [],
			});
		}

		if (roomParticipants?.size === 1) {
			rooms.delete(roomId);
		}

		console.log('Leaving after Room Details', roomDetails);

		socket.to(roomId).emit('notification:userLeftTheRoom', {
			userId: socketIdToUserMap.get(socket.id)?.userId,
		});
		socket.leave(roomId);

		console.log('Socket Rooms---->', Array.from(socket.rooms)[1]);
	});
}
