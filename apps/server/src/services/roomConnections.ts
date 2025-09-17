import { Server, Socket } from 'socket.io';
import prisma from '../lib/prismaClient';

// type hostSocketIdToRoomId = Map<string, string>;
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
		// hostId: string;
		// hostSocketId: string;
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

export function roomConnections(
	socket: Socket,
	io: Server,
	rooms: rooms,
	// hostSocketIdToRoomId: hostSocketIdToRoomId,
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

	socket.on('event:askToJoin', ({ roomId }: { roomId: string }) => {
		console.log('User want to ask-->', {
			roomId,
			userData: socketIdToUserMap.get(socket.id),
		});

		console.log(rooms);

		if (rooms.get(roomId)) {
			if (rooms.get(roomId)?.participants.size === 4) {
				io.to(socket.id).emit('notification:roomLimitFull');
			} else {
				const AllUsers = rooms.get(roomId)?.participants.values();
				const host = Array.from(AllUsers!).find(
					(participant) => participant.host === true
				);

				if (host) {
					io.to(host.socketId).emit('event:userWantToEnter', {
						username: socketIdToUserMap.get(socket.id)?.fullName,
						profilePic: socketIdToUserMap.get(socket.id)?.imageUrl,
						socketId: socket.id,
					});
				} else {
					io.to(socket.id).emit('notification:hostIsNotExistedInRoom');
				}
			}
		} else {
			io.to(socket.id).emit('notification:hostIsNotExistedInRoom');
		}
	});

	socket.on(
		'event:roomEnterPermissionDenied',
		({ socketId }: { socketId: string }) => {
			io.to(socketId).emit('notification:roomEnterPermissionDenied');
		}
	);

	socket.on(
		'event:roomEnterPermissionAccepted',
		({ socketId }: { socketId: string }) => {
			console.log('Host accepted');

			io.to(socketId).emit('event:joinRoom');

			console.log('User Joined in Room', {
				hostUserSocketId: socket.id,
			});
		}
	);

	socket.on(
		'event:joinRoom',
		async ({ roomId, hostUser }: { roomId: string; hostUser: boolean }) => {
			if (!rooms.has(roomId) && hostUser) {
				// hostSocketIdToRoomId.set(socket.id, roomId);
				// const hostUserId = socketIdToUserMap.get(socket.id)?.userId;

				const roomDetails = {
					// hostId: hostUserId!,
					// hostSocketId: socket.id,

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
				console.log('Participant=========>', rooms.get(roomId));

				const updateUser = socketIdToUserMap.get(socket.id)!;

				socketIdToUserMap.set(socket.id, { ...updateUser, host: true });

				// const hostUserId = socketIdToUserMap.get(socket.id)?.userId;
				const roomDetails = {
					// hostId: hostUserId!,
					// hostSocketId: socket.id,
					participants: rooms.get(roomId)!.participants,
				};
				rooms.set(roomId, roomDetails);
			}

			socket.join(roomId);

			const roomInUsers = rooms.get(roomId)!.participants;

			roomInUsers.set(socket.id, socketIdToUserMap.get(socket.id)!);

			const meeting = await prisma.participantsInRoom.upsert({
				where: {
					userId_roomId: {
						roomId,
						userId: socketIdToUserMap.get(socket.id)!.userId,
					},
				},
				update: {},
				create: {
					roomId,
					userId: socketIdToUserMap.get(socket.id)!.userId,
					roomExit: new Date(),
				},
			});

			console.log('MEETING DETails=========>', meeting);

			console.log('USER ENTERED AND ROOM DETAILS+============>>>>', rooms);

			socket.emit('event:enterRoom');

			io.to(roomId).emit('notification:informAllNewUserAdded', {
				userId: socketIdToUserMap.get(socket.id)?.userId,
				username: socketIdToUserMap.get(socket.id)?.fullName,
				socketId: socket.id,
			});

			const AllUsers = rooms.get(roomId)?.participants.values();
			const participantsArray = Array.from(AllUsers!);

			io.to(roomId).emit('event:participantsInRoom', {
				participants: participantsArray,
			});

			io.to(roomId).emit('event:user-connected', {
				userSocketId: socket.id,
			});

			console.log('User Joined in Room', {
				userData: socketIdToUserMap.get(socket.id),
				roomId,
				socketId: socket.id,
				// hostSocketIdToRoomId: hostSocketIdToRoomId.get(socket.id),
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
			socket
				.to(userSocketId)
				.emit('event:getOffer', { offer, socketId: socket.id });
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
			io.to(socketId).emit('event:getAnswer', {
				answer,
				userSocketId: socket.id,
			});
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

			// if (roomDetails?.hostSocketId === socket.id) {
			// 	roomDetails.hostId = '';
			// 	roomDetails.hostSocketId = '';
			// 	roomParticipants?.delete(socket.id);
			// } else {
			// 	roomParticipants?.delete(socket.id);
			// }

			roomParticipants?.delete(socket.id);

			const AllUsers = rooms.get(roomId)?.participants.values();
			const participants = Array.from(AllUsers!);

			io.to(roomId).emit('notification:userLeftTheRoom', {
				user: socketIdToUserMap.get(socket.id),
			});

			io.to(roomId).emit('event:participantsInRoom', {
				participants,
			});

			if (roomParticipants?.size === 0) {
				rooms.delete(roomId);
			}

			socket.leave(roomId);
			console.log('Leaving after Room Details', roomDetails);
		}
	);

	socket.on('event:endRoom', ({ roomId }: { roomId: string }) => {
		// const roomDetails = rooms.get(roomId);
		// if (roomDetails?.hostSocketId === socket.id) {
		io.to(roomId).emit('event:removeEveryoneFromRoom');
		rooms.delete(roomId);
		io.socketsLeave(roomId);
		// }
	});

	socket.on(
		'event:kickUser',
		({ roomId, socketId }: { roomId: string; socketId: string }) => {
			const roomDetails = rooms.get(roomId);
			const roomParticipants = roomDetails?.participants;

			roomParticipants?.delete(socketId);

			const AllUsers = rooms.get(roomId)?.participants.values();
			const participants = Array.from(AllUsers!);

			const userSocket = io.sockets.sockets.get(socketId);

			io.to(roomId).emit('notification:userKickedFromTheRoom', {
				user: socketIdToUserMap.get(socketId),
			});

			io.to(roomId).emit('event:participantsInRoom', {
				participants,
			});

			userSocket?.leave(roomId);

			// console.log('Leaving after Room Details', roomDetails);
		}
	);

	socket.on(
		'event:changeHost',
		({ roomId, socketId }: { roomId: string; socketId: string }) => {
			const roomDetails = rooms.get(roomId);
			const roomParticipants = roomDetails?.participants;

			const currentHost = roomParticipants?.get(socket.id);
			const participant = roomParticipants?.get(socketId);

			if (participant && currentHost) {
				// roomDetails.hostId = socketId;
				// roomDetails.hostSocketId = socketIdToUserMap.get(socketId)!.userId;
				if (participant) {
					participant.host = true;
				}
				if (currentHost) {
					currentHost.host = false;
				}
				roomParticipants?.set(socketId, participant!);
				roomParticipants?.set(socket.id, currentHost!);
			}

			const AllUsers = rooms.get(roomId)?.participants.values();
			const participants = Array.from(AllUsers!);

			io.to(roomId).emit('notification:hostIsChanged', {
				user: socketIdToUserMap.get(socketId),
			});

			io.to(roomId).emit('event:participantsInRoom', {
				participants,
				// roomDetails,
			});
		}
	);

	socket.on('disconnecting', () => {
		const roomId = Array.from(socket.rooms)[1];
		const roomDetails = rooms.get(roomId);
		const roomParticipants = roomDetails?.participants;

		// if (roomDetails?.hostSocketId === socket.id) {
		// 	roomDetails.hostId = '';
		// 	roomDetails.hostSocketId = '';
		// 	roomParticipants?.delete(socket.id);
		// } else {
		// 	roomParticipants?.delete(socket.id);
		// }
		roomParticipants?.delete(socket.id);

		const AllUsers = roomParticipants?.values();

		if (AllUsers) {
			const participantsArray = Array.from(AllUsers);
			io.to(roomId).emit('event:participantsInRoom', {
				participants: participantsArray,
			});
		} else {
			console.log('Error found in All users array in disconnection');
		}

		if (roomParticipants?.size === 0) {
			rooms.delete(roomId);
		}

		console.log(
			'socketIdToUserMap.get(socket.id)========>',
			socketIdToUserMap.get(socket.id)
		);

		socket.to(roomId).emit('notification:userLeftTheRoom', {
			user: socketIdToUserMap.get(socket.id),
		});

		socket.leave(roomId);

		console.log('Socket Rooms---->', Array.from(socket.rooms)[1]);
	});
}
