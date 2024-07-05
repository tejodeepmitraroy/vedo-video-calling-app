'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { useRoomStore } from '@/store/useStreamStore';
import { useRouter } from 'next/navigation';
import MeetRoom from './Screens/MeetRoom';
import WaitingLobby from './Screens/WaitingLobby';

export default function CallPanel({ params }: { params: { roomId: string } }) {
	const [enterRoom, setEnterRoom] = useState<boolean>(false);

	const setRemoteSocketId = useRoomStore((state) => state.setRemoteSocketId);
	const remoteSocketId = useRoomStore((state) => state.remoteSocketId);
	const { userId: id } = useAuth();

	const { socketOn, socketEmit, socketOff } = useSocket();

	const handleJoinRoom = useCallback(
		({
			roomId,
			userId,
			socketId,
			hostUserId,
			hostUser,
		}: {
			roomId: string;
			userId: string;
			hostUserId: string;
			socketId: string;
			hostUser: boolean;
		}) => {
			console.log('User Joined', userId);
			console.log('Socond Socket User Joined', socketId);
			console.log('Host User Id-->', hostUserId);
			// if (userId !== id) setRemoteSocketId(socketId);
			if (hostUserId) {
				setRemoteSocketId(socketId);
				console.log('SET  Remote Socket ID--->', remoteSocketId);
			}

			socketEmit('event:joinRoom', {
				roomId,
				userId,
				id,
				hostUser,
			});
		},
		[id, socketEmit]
	);

	const handleEnterRoom = useCallback(
		({ userId, id }: { userId: string; id: string }) => {
			setEnterRoom(true);
		},
		[]
	);

	//// All socket Notification Function are Define Here
	const handleInformAllNewUserAdded = useCallback(
		({ userId, socketId }: { userId: string; socketId: string }) => {
			console.log('Notiof', { userId, socketId });

			if (id === userId) {
				// toast.success(`suceesfully joined ${socketId}`);
				toast.success(`suceesfully joined`);
			} else {
				toast(`User Joined, his/her -> ${userId} `);
				
			}
		},
		[id]
	);

	const handleUserLeftTheRoom = useCallback(
		({ userId }: { userId: string }) => {
			if (id === userId) {
				toast.success(`You Left the Room`);
			} else {
				toast.info(`${id} Left the Room`);
			}
		},
		[id]
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
					// MeetingDetails={roomDetails}
					roomId={params.roomId}
					// isFetchingRoomDetails={isFetchingRoomDetails}
				/>
			)}
			{/* <OutsideLobby/> */}
		</>
	);
}
