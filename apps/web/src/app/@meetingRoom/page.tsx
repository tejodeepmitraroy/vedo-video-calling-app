'use client';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';
import UserVideoPanel from '../@waitingLobby/components/UserVideoPanel';
import Image from 'next/image';
import { useWebRTC } from '@/context/WebRTCContext';
import RemoteUserVideoPanel from './components/RemoteUserVideoPanel';
import useStreamStore from '@/store/useStreamStore';
import useParticipantsStore from '@/store/useParticipantsStore';
import ControlPanel from './components/ControlPanel';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
	const { streams } = useWebRTC();

	const { socketOn, socketEmit, socketOff } = useSocket();
	const localStream = useStreamStore((state) => state.localStream);
	const setOnlineUsers = useParticipantsStore((state) => state.setParticipants);

	console.log('Meeting Component mounted++++++++++');

	//////////////////////////////////////////////////////////////////////////////////////////////

	///// All socket Event Function are Define Here
	const roomEnterPermissionAccepted = useCallback(
		async (socketId: string) => {
			socketEmit('event:roomEnterPermissionAccepted', {
				socketId,
			});
		},
		[socketEmit]
	);

	const roomEnterPermissionDenied = useCallback(
		(socketId: string) => {
			socketEmit('event:roomEnterPermissionDenied', { socketId });
		},
		[socketEmit]
	);

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
			toast((t) => (
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
								roomEnterPermissionAccepted(socketId);
							}}
						>
							Accept
						</Button>
						<Button
							size={'sm'}
							variant={'default'}
							onClick={() => {
								toast.dismiss(t.id);
								roomEnterPermissionDenied(socketId);
							}}
						>
							Rejected
						</Button>
					</div>
				</div>
			));
		},
		[roomEnterPermissionAccepted, roomEnterPermissionDenied]
	);

	useEffect(() => {
		socketOn('event:userWantToEnter', userWantToEnter);
		return () => {
			socketOff('event:userWantToEnter', userWantToEnter);
		};
	}, [socketOff, socketOn, userWantToEnter]);

	////////////////////////////////////////////////////////////////////////////////////////////

	const handleParticipantsInRoom = useCallback(
		({
			participants,
		}: {
			participants: {
				socketId: string;
				userId: string;
				fullName: string;
				imageUrl: string;
				emailAddress: string;
				host: boolean;
			}[];
		}) => {
			console.log('ParticipantsInRoom=========>', participants);
			setOnlineUsers(participants);
		},
		[setOnlineUsers]
	);

	useEffect(() => {
		socketOn('event:participantsInRoom', handleParticipantsInRoom);

		return () => {
			socketOff('event:participantsInRoom', handleParticipantsInRoom);
		};
	}, [handleParticipantsInRoom, socketOff, socketOn]);

	///////////////////////////////////////////////////////////////////////////////////////////

	///// All socket Event Function are Executed Here

	return (
		<main className="relative flex h-screen w-full overflow-hidden bg-[#222831]">
			<div className="flex h-full w-full justify-between gap-4 p-4 px-4 pb-20 sm:pb-4 md:pb-20">
				{streams.length === 0 && (
					<div className="mx-auto flex w-full items-center justify-center md:max-w-[90rem]">
						<RemoteUserVideoPanel stream={localStream!} />
					</div>
				)}

				{streams.length === 1 && (
					<div className="mx-auto flex w-full flex-col items-center justify-center gap-5 md:max-w-[90rem] md:flex-row">
						{streams.map((stream, index) => (
							<RemoteUserVideoPanel key={index} stream={stream} />
						))}

						<div className="absolute bottom-[10vh] right-8 z-40 aspect-square w-[20%] resize sm:aspect-video md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
							<UserVideoPanel />
						</div>
					</div>
				)}

				{streams.length > 1 && (
					<div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row">
						{streams.map((stream, index) => (
							<div key={index} className="w-full">
								<RemoteUserVideoPanel stream={stream} />
							</div>
						))}
						<RemoteUserVideoPanel stream={localStream!} />

						<div className="absolute bottom-[10vh] right-8 z-40 aspect-square w-[20%] resize sm:aspect-video md:bottom-[15vh] md:right-16 md:hidden md:w-[20%] lg:w-[12%]">
							<UserVideoPanel />
						</div>
					</div>
				)}
			</div>

			<ControlPanel roomId={roomId} />
		</main>
	);
};

export default MeetingRoom;
