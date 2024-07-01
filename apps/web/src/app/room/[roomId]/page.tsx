'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import WaitingLobby from './Screens/WaitingLobby';
import MeetRoom from './Screens/MeetRoom';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { useRoomStore } from '@/store/useStreamStore';

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
				setRoomDetails(response);
				console.log('Room Details---->', response);
			} catch (error) {
				console.log(error);
			}
		}
	}, [getToken, params.roomId]);

	useEffect(() => {
		getRoomDetails();
	}, [getRoomDetails]);

	const handleJoinRoom = useCallback(
		({ userId, id }: { userId: string; id: string }) => {
			console.log('User Joined', userId);
			console.log('Socket User Joined', id);
			setRemoteSocketId(id);
			setEnterRoom(true);
		},
		[setRemoteSocketId]
	);
	const handleInformAllNewUserAdded = useCallback(
		({ id, socketId }: { id: string; socketId: string }) => {
			console.log('Notiof', { id, socketId });
			if (id === userId) {
				toast(`suceesfully joined ${socketId}`);
			} else {
				toast(`User Joined, his/her -> ${userId} & ${socketId} `);
			}
		},
		[userId]
	);

	useEffect(() => {
		socketOn('event:joinRoom', handleJoinRoom);

		socketOn('notification:informAllNewUserAdded', handleInformAllNewUserAdded);
		return () => {
			socketOff('event:joinRoom', handleJoinRoom);
			socketOff(
				'notification:informAllNewUserAdded',
				handleInformAllNewUserAdded
			);
		};
	}, [handleInformAllNewUserAdded, handleJoinRoom, socketOff, socketOn]);

	return (
		<>
			{enterRoom ? (
				// <>Meeting Room</>
				<MeetRoom roomId={params.roomId} />
			) : (
				// <>Waiting Room</>
				<WaitingLobby MeetingDetails={roomDetails} roomId={params.roomId} />
			)}
		</>
	);
}
