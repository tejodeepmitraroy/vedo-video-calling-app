'use client';
import { useSocket } from '@/context/SocketContext';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useParticipantsStore from '@/store/useParticipantsStore';

export const useMeetingRoomSocket = () => {
	const { socketOn, socketEmit, socketOff } = useSocket();
	const setOnlineUsers = useParticipantsStore((state) => state.setParticipants);

	// --- Host accepts/denies user entry ---
	const acceptUser = useCallback(
		(socketId: string) => {
			socketEmit('event:roomEnterPermissionAccepted', { socketId });
		},
		[socketEmit]
	);

	const denyUser = useCallback(
		(socketId: string) => {
			socketEmit('event:roomEnterPermissionDenied', { socketId });
		},
		[socketEmit]
	);

	// --- Someone asks to join ---
	const userWantToEnter = useCallback(
		async ({
			username,
			profilePic,
			socketId,
		}: {
			username: string;
			profilePic: string;
			socketId: string;
		}) => {
			toast(
				(t) => (
					<div className="w-full">
						<div className="flex">
							<div className="flex w-[20%] items-center justify-center">
								<Image
									src={profilePic}
									width={30}
									height={30}
									className="rounded-full"
									alt={'Profile Pic'}
								/>
							</div>
							<div className="w-[80%]">{username} Want to Enter</div>
						</div>
						<div className="flex justify-evenly">
							<Button
								size={'sm'}
								variant={'default'}
								onClick={() => {
									toast.dismiss(t.id);
									acceptUser(socketId);
								}}
							>
								Accept
							</Button>
							<Button
								size={'sm'}
								variant={'default'}
								onClick={() => {
									toast.dismiss(t.id);
									denyUser(socketId);
								}}
							>
								Rejected
							</Button>
						</div>
					</div>
				),
				{
					duration: 600000,
				}
			);
		},
		[acceptUser, denyUser]
	);

	useEffect(() => {
		socketOn('event:userWantToEnter', userWantToEnter);
		return () => {
			socketOff('event:userWantToEnter', userWantToEnter);
		};
	}, [socketOff, socketOn, userWantToEnter]);

	////////////////////////////////////////////////////////////////////////////////////////////
	const participantsInRoom = useCallback(
		({
			participants,
			// roomDetails,
		}: {
			participants: {
				socketId: string;
				userId: string;
				fullName: string;
				imageUrl: string;
				emailAddress: string;
				host: boolean;
				stream: MediaStream;
			}[];
		}) => {
			console.log('ParticipantsInRoom=========>', participants);
			setOnlineUsers(participants);
			// setRoomDetails(roomDetails);
		},
		[setOnlineUsers]
	);

	useEffect(() => {
		socketOn('event:participantsInRoom', participantsInRoom);
		return () => {
			socketOff('event:participantsInRoom', participantsInRoom);
		};
	}, [socketOff, socketOn, participantsInRoom]);
};

export default useMeetingRoomSocket;
