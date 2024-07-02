'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import WaitingLobby from './Screens/WaitingLobby';
import MeetRoom from './Screens/MeetRoom';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { useRoomStore } from '@/store/useStreamStore';
import { useRouter } from 'next/navigation';
import OutsideLobby from './Screens/OutsideLobby';

interface MeetingDetails {
	createdAt: Date;
	createdById: string;
	description: string | null;
	endTime: Date | null;
	id: string;
	meetingId: string;
	participantIds: string[];
	startTime: Date | null;
	title: string;
	updatedAt: Date;
	videoCallUrl: string;
}

export default function CallPanel({ params }: { params: { roomId: string } }) {
	const [roomDetails, setRoomDetails] = useState<MeetingDetails | undefined>();
	const [enterRoom, setEnterRoom] = useState<boolean>(false);
	const setRemoteSocketId = useRoomStore((state) => state.setRemoteSocketId);

	const { getToken, userId } = useAuth();
	const router = useRouter();
	const { socket, socketOn, socketEmit, socketOff } = useSocket();

	const getRoomDetails = useCallback(async () => {
		const token = await getToken();

		if (params.roomId) {
			try {
				const { data } = await axios(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/call/${params.roomId}`,

					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);

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
			roomId,
			userId,
			id,
			hostUser,
		}: {
			roomId: string;
			userId: string;
			id: string;
			hostUser: boolean;
		}) => {
			console.log('User Joined', userId);
			console.log('Socket User Joined', id);
			// setRemoteSocketId(id);
			socketEmit('event:joinRoom', {
				roomId,
				userId,
				id,
				hostUser,
			});
		},
		[socketEmit]
	);
	const handleInformAllNewUserAdded = useCallback(
		({ id, socketId }: { id: string; socketId: string }) => {
			console.log('Notiof', { id, socketId });
			setRemoteSocketId(socketId);

			console.log('Remote Socket ID--->', socketId);
			if (id === userId) {
				toast(`suceesfully joined ${socketId}`);
			} else {
				toast(`User Joined, his/her -> ${userId} & ${socketId} `);
			}
		},
		[setRemoteSocketId, userId]
	);

	const handleHostIsNoExistInRoom = useCallback(() => {
		toast.warn(`Host is Not Existed in Room. Please wait`);
	}, []);

	const handleUserLeftTheRoom = useCallback(
		({ id }: { id: string }) => {
			if (id === userId) {
				toast.info(`You Left the Room`);
			} else {
				toast.info(`${id} Left the Room`);
			}
		},
		[userId]
	);

	const handleEnterRoom = useCallback(
		({ userId, id }: { userId: string; id: string }) => {
			setEnterRoom(true);
		},
		[]
	);

	//All Notifications Event state here
	useEffect(() => {
		socketOn('event:joinRoom', handleJoinRoom);
		socketOn('event:enterRoom', handleEnterRoom);

		socketOn('notification:informAllNewUserAdded', handleInformAllNewUserAdded);
		socketOn('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
		socketOn('notification:userLeftTheRoom', handleUserLeftTheRoom);
		return () => {
			socketOff('event:joinRoom', handleJoinRoom);
			socketOff('event:enterRoom', handleEnterRoom);
			socketOff(
				'notification:informAllNewUserAdded',
				handleInformAllNewUserAdded
			);
			socketOff('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
			socketOff('notification:userLeftTheRoom', handleUserLeftTheRoom);
		};
	}, [
		handleEnterRoom,
		handleHostIsNoExistInRoom,
		handleInformAllNewUserAdded,
		handleJoinRoom,
		handleUserLeftTheRoom,
		socketOff,
		socketOn,
	]);

	return (
		<>
			{enterRoom ? (
				<MeetRoom roomId={params.roomId} />
			) : (
				<WaitingLobby MeetingDetails={roomDetails} roomId={params.roomId} />
			)}
			{/* <OutsideLobby/> */}
		</>
	);
}
