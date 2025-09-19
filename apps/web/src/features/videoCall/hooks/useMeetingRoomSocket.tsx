'use client';
import React from 'react';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import Image from 'next/image';
import { useSocket } from '@/context/SocketContext';
import useParticipantsStore from '@/store/useParticipantsStore';
import { Button } from '@/components/ui/button';

export const useMeetingRoomSocket = () => {
	const { socketOn, socketEmit, socketOff } = useSocket();
	const setParticipants = useParticipantsStore((s) => s.setParticipants);

	/* outgoing helpers */
	const acceptUser = useCallback(
		(socketId: string) =>
			socketEmit('event:roomEnterPermissionAccepted', { socketId }),
		[socketEmit]
	);

	const denyUser = useCallback(
		(socketId: string) =>
			socketEmit('event:roomEnterPermissionDenied', { socketId }),
		[socketEmit]
	);

	useEffect(() => {
		const userWantToEnter = ({
			username,
			profilePic,
			socketId,
		}: {
			username: string;
			profilePic: string;
			socketId: string;
		}) => {
			toast.custom((t) => (
				<div className="w-full">
					<div className="flex">
						<div className="flex w-[20%] items-center justify-center">
							<Image
								src={profilePic}
								width={30}
								height={30}
								className="rounded-full"
								alt="Profile Pic"
							/>
						</div>
						<div className="w-[80%]">{username} wants to enter</div>
					</div>
					<div className="mt-2 flex justify-evenly">
						<Button
							size="sm"
							onClick={() => {
								toast.dismiss(t.id);
								acceptUser(socketId);
							}}
						>
							Accept
						</Button>
						<Button
							size="sm"
							variant="destructive"
							onClick={() => {
								toast.dismiss(t.id);
								denyUser(socketId);
							}}
						>
							Reject
						</Button>
					</div>
				</div>
			));
		};

		const participantsInRoom = ({
			participants,
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
			setParticipants(participants);
		};

		socketOn('event:userWantToEnter', userWantToEnter);
		socketOn('event:participantsInRoom', participantsInRoom);

		return () => {
			socketOff('event:userWantToEnter', userWantToEnter);
			socketOff('event:participantsInRoom', participantsInRoom);
		};
	}, [acceptUser, denyUser, setParticipants, socketOn, socketOff]);

	return { acceptUser, denyUser };
};
