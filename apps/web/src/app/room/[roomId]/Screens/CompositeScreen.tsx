'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { useRoomStore } from '@/store/useStreamStore';
import { useRouter } from 'next/navigation';
import MeetRoom from './MeetRoom';
import WaitingLobby from './WaitingLobby';

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

const CompositeScreen = ({
	roomId,
	roomDetails,
}: {
	roomId: string;
	roomDetails: MeetingDetails | null;
}) => {
	// const [roomDetails, setRoomDetails] = useState<MeetingDetails | undefined>();
	const [enterRoom, setEnterRoom] = useState<boolean>(false);
	const setRemoteSocketId = useRoomStore((state) => state.setRemoteSocketId);

	const { getToken, userId } = useAuth();
	const router = useRouter();
	const { socket, socketOn, socketEmit, socketOff } = useSocket();

	const roomNotFound = useCallback(() => {
		if (!roomDetails) {
			toast.error('Room Id Not Exsisted');
			router.push('/');
		}
	}, [roomDetails, router]);

    useEffect(()=>{
        roomNotFound;
    },[roomNotFound])

	// const getRoomDetails = useCallback(async () => {
	// 	const token = await getToken();

	// 	if (roomId) {
	// 		try {
	// 			const { data } = await axios(
	// 				`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/call/${roomId}`,
	// 				{
	// 					headers: {
	// 						'Content-Type': 'application/json',
	// 						Authorization: `Bearer ${token}`,
	// 					},
	// 				}
	// 			);

	// 			const response = data.data;
	// 			console.log('Room Details---->', response);

	// 			if (response) {
	// 				setRoomDetails(response);
	// 			} else {
	// 				toast.error('Room Id Not Exsisted');
	// 				router.push('/');
	// 			}
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// }, [getToken, roomId, router]);

	// useEffect(() => {
	// 	getRoomDetails();
	// }, [getRoomDetails]);

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

		return () => {
			socketOff('event:joinRoom', handleJoinRoom);
			socketOff('event:enterRoom', handleEnterRoom);
		};
	}, [handleEnterRoom, handleJoinRoom, socketOff, socketOn]);

	return (
		<>
			{enterRoom ? (
				<MeetRoom roomId={roomId} />
			) : (
				<WaitingLobby MeetingDetails={roomDetails} roomId={roomId} />
			)}
			{/* <OutsideLobby/> */}
		</>
	);
};

export default CompositeScreen;
