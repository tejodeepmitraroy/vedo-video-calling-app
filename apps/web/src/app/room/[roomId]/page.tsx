'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { useRoomStore } from '@/store/useStreamStore';
import { useRouter } from 'next/navigation';
import MeetRoom from './Screens/MeetRoom';
import WaitingLobby, { MeetingDetails } from './Screens/WaitingLobby';

export default function CallPanel({ params }: { params: { roomId: string } }) {
	const [enterRoom, setEnterRoom] = useState<boolean>(false);
	const [roomDetails, setRoomDetails] = useState<MeetingDetails | undefined>();

	const setRemoteSocketId = useRoomStore((state) => state.setRemoteSocketId);
	const remoteSocketId = useRoomStore((state) => state.remoteSocketId);
	// const { userId: id } = useAuth();
	const router = useRouter();
	const { socketOn, socketEmit, socketOff } = useSocket();
	const { getToken, userId } = useAuth();
	const { user } = useUser();

	const getRoomDetails = useCallback(async () => {
		const token = await getToken();

		if (params.roomId) {
			try {
				// setIsFetchingRoomDetails(true);

				const { data } = await axios(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/call/${params.roomId}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);
				// setIsFetchingRoomDetails(false);
				const response = data.data;
				console.log('Room Details---->', response);

				if (response) {
					setRoomDetails(response);
				} else {
					toast.error('Room Id Not Exsisted');
					router.push('/');
				}
			} catch (error) {
				console.log(error);
			}
		}
	}, [getToken, params.roomId, router]);

	useEffect(() => {
		getRoomDetails();
	}, [getRoomDetails]);

	const handleJoinRoom = useCallback(
		({
			hostUserSocketId,
			// hostUserId,
		}: {
			hostUserSocketId: string;
			// hostUserId: string;
		}) => {
			console.log('Socond Socket User Joined', hostUserSocketId);
			// console.log('Host User Id-->', hostUserId);
			// if (userId !== id) setRemoteSocketId(socketId);
			if (hostUserSocketId) {
				setRemoteSocketId(hostUserSocketId);
				console.log('SET  Remote Socket ID--->', hostUserSocketId);
			}

			if (roomDetails?.meetingId !== userId) {
				socketEmit('event:joinRoom', {
					roomId: params.roomId,
					userId,
					username: user?.fullName,
					hostUser: false,
				});
			}
		},
		[socketEmit]
	);

	const handleEnterRoom = useCallback(
		({ userId, id }: { userId: string; id: string }) => {
			setEnterRoom(true);
		},
		[]
	);

	//// All socket Notification Function are Define Here
	const handleInformAllNewUserAdded = useCallback(
		({ userId: id, username }: { userId: string; username: string }) => {
			console.log('Notiof', { userId, username });

			if (id === userId) {
				// toast.success(`suceesfully joined ${socketId}`);
				toast.success(`suceesfully joined`);
			} else {
				toast(`${username} Joined`);
			}
		},
		[]
	);

	const handleUserLeftTheRoom = useCallback(
		({ userId: id }: { userId: string }) => {
			if (id === userId) {
				toast.success(`You Left the Room`);
			} else {
				toast.info(`${id} Left the Room`);
			}
		},
		[]
	);

	//All Event state here
	useEffect(() => {
		socketOn('event:joinRoom', handleJoinRoom);
		socketOn('event:enterRoom', handleEnterRoom);

		return () => {
			socketOff('event:joinRoom', handleJoinRoom);
			socketOff('event:enterRoom', handleEnterRoom);
		};
	}, [handleEnterRoom, handleJoinRoom, socketOff, socketOn]);

	//All Notifications Event state here
	useEffect(() => {
		socketOn('notification:informAllNewUserAdded', handleInformAllNewUserAdded);
		socketOn('notification:userLeftTheRoom', handleUserLeftTheRoom);
		return () => {
			socketOff(
				'notification:informAllNewUserAdded',
				handleInformAllNewUserAdded
			);
			socketOff('notification:userLeftTheRoom', handleUserLeftTheRoom);
		};
	}, [handleInformAllNewUserAdded, handleUserLeftTheRoom, socketOff, socketOn]);

	return (
		<>
			{enterRoom ? (
				<MeetRoom roomId={params.roomId} />
			) : (
				<WaitingLobby
					meetingDetails={roomDetails!}
					roomId={params.roomId}
					// isFetchingRoomDetails={isFetchingRoomDetails}
				/>
			)}
			{/* <OutsideLobby/> */}
		</>
	);
}
