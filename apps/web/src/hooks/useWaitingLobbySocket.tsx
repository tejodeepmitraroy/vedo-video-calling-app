'use client';
import { useSocket } from '@/context/SocketContext';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';

import useGlobalStore from '@/store/useGlobalStore';
import { getRoomDetails } from '@/features/videoCall/services';
import useNotificationSocket from './useNotificationSocket';
import useScreenStateStore from '@/store/useScreenStateStore';
import { useRouter } from 'next/navigation';

// interface Participant {
// 	socketId: string;
// 	userId: string;
// 	username: string;
// 	profilePic: string;
// 	isHost: boolean;
// 	isMuted: boolean;
// 	isVideoOn: boolean;
// }

export const useWaitingLobbySocket = (roomId: string) => {
	const { socketOn, socketOff, socketEmit } = useSocket();
	const [askToEnterLoading, setAskToEnterLoading] = useState(false);
	const { getToken, userId } = useAuth();
	const roomDetails = useGlobalStore((state) => state.roomDetails);
	const setRoomDetails = useGlobalStore((state) => state.setRoomDetails);
	const setCurrentScreen = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const router = useRouter();

	console.log('HOOOJK roomId--------->', roomId);
	console.log('HOOOJK userId--------->', userId);
	const roomDetailsFetch = useCallback(async () => {
		const token = await getToken();

		try {
			const response = await getRoomDetails(token, roomId);

			const roomDetails = response;

			console.log('roomDetails--------->', roomDetails);

			/////////////////////////////////////////////////////////////////////////////
			const checkJoinedRoom = response.createdBy.id === userId;

			socketEmit('event:checkPreviouslyJoinedRoom', {
				roomId,
				hostUser: checkJoinedRoom,
			});

			if (roomDetails) {
				setRoomDetails(roomDetails);
			} else {
				router.push('/');
			}
		} catch (error) {
			console.error('Error fetching room details:', error);
			toast.error('Failed to fetch room details');
			router.push('/');
		}
	}, [getToken, roomId, router, setRoomDetails, socketEmit, userId]);

	useEffect(() => {
		roomDetailsFetch();
	}, [roomDetailsFetch]);

	// --- User want to join Room ---

	//User join Room
	const handleJoinRoom = useCallback(async () => {
		const checkJoinedRoom = roomDetails?.createdById === userId;
		console.log('HOOOJK askToJoin --------->', checkJoinedRoom);
		socketEmit('event:joinRoom', {
			roomId: roomId,
			hostUser: checkJoinedRoom,
		});
	}, [roomDetails?.createdById, roomId, socketEmit, userId]);

	//User ask join Room
	const handleAskToJoin = useCallback(async () => {
		socketEmit('event:askToJoin', {
			roomId,
		});

		setAskToEnterLoading(true);
	}, [roomId, socketEmit]);

	//--- Get Notification Events from Room Host ---
	const { askToEnterLoading: askToEnterLoadingFromSocket } =
		useNotificationSocket();

	useEffect(() => {
		setAskToEnterLoading(askToEnterLoadingFromSocket);
	}, [askToEnterLoadingFromSocket]);

	////////////////////////////////////////////////

	//--- User join Waiting Room ---

	//// All socket Event Function are Define Here
	const joinRoom = useCallback(async () => {
		socketEmit('event:joinRoom', {
			roomId: roomId,
			hostUser: false,
		});
	}, [roomId, socketEmit]);

	const handleEnterRoom = useCallback(() => {
		setCurrentScreen('Meeting Room');
	}, [setCurrentScreen]);

	//// All socket Notification are Executed Here
	useEffect(() => {
		// console.log('Setup All Socket Events ------------->>>');
		socketOn('event:joinRoom', joinRoom);
		socketOn('event:enterRoom', handleEnterRoom);
		return () => {
			// console.log('Off All Socket Events ------------->>>');
			socketOff('event:joinRoom', joinRoom);
			socketOff('event:enterRoom', handleEnterRoom);
		};
	}, [joinRoom, handleEnterRoom, socketOff, socketOn]);

	//User join Waiting Room

	// const joinWaitingRoom = useCallback(
	// 	(userData: {
	// 		userId: string;
	// 		username: string;
	// 		profilePic: string;
	// 		isHost: boolean;
	// 	}) => {
	// 		socketEmit('event:joinWaitingRoom', {
	// 			roomId,
	// 			userData: {
	// 				...userData,
	// 				isMuted: false,
	// 				isVideoOn: true,
	// 			},
	// 		});
	// 	},
	// 	[roomId, socketEmit]
	// );

	// // --- Handle room joined successfully ---
	// const onRoomJoined = useCallback(
	// 	(data: { participants: Participant[]; isHost: boolean }) => {
	// 		setParticipants(data.participants);
	// 		setIsHost(data.isHost);
	// 		setRoomReady(true);
	// 	},
	// 	[]
	// );

	// // --- Someone asks to join ---
	// const userWantToEnter = useCallback(
	// 	async ({
	// 		username,
	// 		profilePic,
	// 		socketId,
	// 	}: {
	// 		username: string;
	// 		profilePic: string;
	// 		socketId: string;
	// 	}) => {
	// 		toast(
	// 			(t) => (
	// 				<div className="w-full">
	// 					<div className="flex">
	// 						<div className="flex w-[20%] items-center justify-center">
	// 							<Image
	// 								src={profilePic}
	// 								width={30}
	// 								height={30}
	// 								className="rounded-full"
	// 								alt={'Profile Pic'}
	// 							/>
	// 						</div>
	// 						<div className="w-[80%]">{username} wants to enter</div>
	// 					</div>
	// 					<div className="flex justify-evenly">
	// 						<Button
	// 							size={'sm'}
	// 							variant={'default'}
	// 							onClick={() => {
	// 								toast.dismiss(t.id);
	// 								acceptUser(socketId);
	// 							}}
	// 						>
	// 							Accept
	// 						</Button>
	// 						<Button
	// 							size={'sm'}
	// 							variant={'destructive'}
	// 							onClick={() => {
	// 								toast.dismiss(t.id);
	// 								denyUser(socketId);
	// 							}}
	// 						>
	// 							Reject
	// 						</Button>
	// 					</div>
	// 				</div>
	// 			),
	// 			{
	// 				duration: 60000, // 1 minute to respond
	// 			}
	// 		);
	// 	},
	// 	[acceptUser, denyUser]
	// );

	// // --- Handle participant updates ---
	// const onParticipantUpdate = useCallback(
	// 	(updatedParticipants: Participant[]) => {
	// 		setParticipants(updatedParticipants);
	// 		setOnlineUsers(updatedParticipants);
	// 	},
	// 	[setOnlineUsers]
	// );

	// // --- Handle participant left ---
	// const onParticipantLeft = useCallback(
	// 	({
	// 		participantId,
	// 		newHostId,
	// 	}: {
	// 		participantId: string;
	// 		newHostId?: string;
	// 	}) => {
	// 		setParticipants((prev) => {
	// 			const updated = prev.filter((p) => p.socketId !== participantId);

	// 			// If host left and there are other participants
	// 			if (newHostId && updated.some((p) => p.socketId === newHostId)) {
	// 				updated.forEach((p) => {
	// 					p.isHost = p.socketId === newHostId;
	// 				});

	// 				if (socket?.id === newHostId) {
	// 					setIsHost(true);
	// 					toast.success('You are now the host of the meeting');
	// 				}
	// 			}

	// 			setOnlineUsers(updated);
	// 			return updated;
	// 		});
	// 	},
	// 	[setOnlineUsers, socket?.id]
	// );

	// // --- Handle room closed by host ---
	// const onRoomClosed = useCallback(() => {
	// 	toast.error('The host has ended the meeting');
	// 	// Redirect to home or previous page
	// 	// router.push('/');
	// }, []);

	// // --- Handle permission denied ---
	// const onPermissionDenied = useCallback(({ reason }: { reason: string }) => {
	// 	toast.error(`Entry denied: ${reason}`);
	// 	// Redirect to home or previous page
	// 	// router.push('/');
	// }, []);

	// // --- Set up all socket event listeners ---
	// useEffect(() => {
	// 	// Socket event listeners
	// 	socketOn('event:roomJoined', onRoomJoined);
	// 	socketOn('event:participantUpdate', onParticipantUpdate);
	// 	socketOn('event:participantLeft', onParticipantLeft);
	// 	socketOn('event:roomClosed', onRoomClosed);
	// 	socketOn('event:permissionDenied', onPermissionDenied);
	// 	socketOn('event:userWantToEnter', userWantToEnter);

	// 	return () => {
	// 		// Cleanup all event listeners
	// 		socketOff('event:roomJoined', onRoomJoined);
	// 		socketOff('event:participantUpdate', onParticipantUpdate);
	// 		socketOff('event:participantLeft', onParticipantLeft);
	// 		socketOff('event:roomClosed', onRoomClosed);
	// 		socketOff('event:permissionDenied', onPermissionDenied);
	// 		socketOff('event:userWantToEnter', userWantToEnter);
	// 	};
	// }, [
	// 	socketOn,
	// 	socketOff,
	// 	onRoomJoined,
	// 	onParticipantUpdate,
	// 	onParticipantLeft,
	// 	onRoomClosed,
	// 	onPermissionDenied,
	// 	userWantToEnter,
	// ]);

	// // --- Handle user leaving the waiting room ---
	// const leaveWaitingRoom = useCallback(() => {
	// 	if (socket) {
	// 		socketEmit('event:leaveWaitingRoom', { roomId });
	// 	}
	// }, [roomId, socket, socketEmit]);

	// // --- Start the meeting (host only) ---
	// const startMeeting = useCallback(() => {
	// 	if (!isHost) return;
	// 	socketEmit('event:startMeeting', { roomId });
	// }, [isHost, roomId, socketEmit]);

	// // --- Toggle mute ---
	// const toggleMute = useCallback(
	// 	(isMuted: boolean) => {
	// 		socketEmit('event:updateParticipant', {
	// 			roomId,
	// 			updates: { isMuted },
	// 		});
	// 	},
	// 	[roomId, socketEmit]
	// );

	// --- Toggle video ---
	const toggleVideo = useCallback(
		(isVideoOn: boolean) => {
			socketEmit('event:updateParticipant', {
				roomId,
				updates: { isVideoOn },
			});
		},
		[roomId, socketEmit]
	);

	return {
		handleJoinRoom,
		handleAskToJoin,
		askToEnterLoading,
		toggleVideo,
	};
};

export default useWaitingLobbySocket;
