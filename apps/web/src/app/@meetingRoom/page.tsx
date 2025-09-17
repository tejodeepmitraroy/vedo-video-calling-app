'use client';
import React from 'react';
// import { Button } from '@/components/ui/button';
import { useMeetingRoomSocket } from '../../feature/videoCall/hooks/useMeetingRoomSocket';
// import toast from 'react-hot-toast';
import UserVideoPanel from '../../feature/videoCall/components/UserVideoPanel';
// import Image from 'next/image';
import { useWebRTC } from '@/context/WebRTCContext';
import RemoteUserVideoPanel from '../../feature/videoCall/components/RemoteUserVideoPanel';
// import useParticipantsStore from '@/store/useParticipantsStore';
import ControlPanel from '../../feature/videoCall/components/ControlPanel';
import { useUser } from '@clerk/nextjs';
import { MonitorUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import useGlobalStore from '@/store/useGlobalStore';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
	const { streams } = useWebRTC();
	const { user } = useUser();

	// initialise socket listeners
	useMeetingRoomSocket();
	// const participants = useParticipantsStore(state=>state.participants)
	// const setRoomDetails = useGlobalStore((state) => state.setRoomDetails);

	console.log('Meeting Component mounted++++++++++');

	/*
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
				),
				{
					duration: 600000,
				}
			);
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
		socketOn('event:participantsInRoom', handleParticipantsInRoom);

		return () => {
*/
	return (
		<main className="relative flex h-screen w-full overflow-hidden bg-[#222831]">
			<div className="h-full w-full flex-col justify-between gap-4 p-4 px-4 pb-20 sm:pb-4 md:pb-20">
				<div className="flex items-center justify-between">
					<span className="flex items-center gap-2">
						{' '}
						<MonitorUp size={'20'} />
						Tejodeep Mitra Roy (You, presenting)
					</span>

					<Button size={'sm'}>Stop presenting</Button>
				</div>
				{/* {isScreenSharing ? (
					<div className="mx-auto flex w-full items-center justify-center md:max-w-[90rem]">
						<ScreenSharePanel />
						<div className="absolute bottom-[12vh] right-8 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
							<UserVideoPanel />
							<span className="absolute bottom-3 left-4 z-40 rounded-lg text-xs font-semibold text-white sm:text-base">
								{user?.fullName}
							</span>
						</div>
					</div>
				) : (
					<>
						{streams.length === 0 && (
							<div className="relative mx-auto flex w-full items-center justify-center md:max-w-[90rem]">
								<UserVideoPanel />
								<span className="absolute bottom-3 left-4 z-40 rounded-lg text-xs font-semibold text-white sm:text-base">
									{user?.fullName}
								</span>
							</div>
						)}
						{streams.length === 1 && (
							<div className="mx-auto flex w-full flex-col items-center justify-center gap-5 md:max-w-[90rem] md:flex-row">
								{streams.map((stream, index) => (
									<RemoteUserVideoPanel key={index} stream={stream} />
								))}
								<div className="absolute bottom-[12vh] right-8 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
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
								{/* <RemoteUserVideoPanel stream={localStream!} /> 

								<div className="absolute bottom-[12vh] right-8 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
									<UserVideoPanel />
								</div>
							</div>
						)}
					</>
				)} */}

				{streams.length === 0 && (
					<div className="relative grid h-full w-full grid-cols-1">
						<div className="mx-auto flex h-full w-full items-center justify-center gap-5 md:max-w-[90rem]">
							<UserVideoPanel />
							<span className="absolute bottom-3 left-4 z-40 rounded-lg text-xs font-semibold text-white sm:text-base">
								{user?.fullName}
							</span>
						</div>
					</div>
				)}

				{streams.length === 1 && (
					<div className="relative grid h-full w-full grid-cols-1">
						<div className="mx-auto flex w-full flex-col items-center justify-center gap-5 md:max-w-[90rem] md:flex-row">
							{streams.map((stream, index) => (
								<RemoteUserVideoPanel key={index} stream={stream} />
							))}
						</div>
						<div className="absolute bottom-[7vh] right-3 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[3vh] md:right-8 md:w-[20%] lg:right-14 lg:w-[12%]">
							<UserVideoPanel />
						</div>
					</div>
				)}

				{(streams.length === 2 || streams.length === 3) && (
					<div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4">
						{streams.map((stream, index) => (
							<div
								key={index}
								className="flex h-full w-full flex-col items-center justify-center gap-5 md:flex-row"
							>
								<RemoteUserVideoPanel stream={stream} />
							</div>
						))}
						<div className="relative flex h-full w-full flex-col items-center justify-center gap-5 md:flex-row">
							<UserVideoPanel />
							<span className="absolute bottom-3 left-4 z-40 rounded-lg text-xs font-semibold text-white sm:text-base">
								{user?.fullName}
							</span>
						</div>
						{/* <div className="absolute bottom-[12vh] right-8 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
								<UserVideoPanel />
							</div> */}
					</div>
				)}

				{/* {streams.length === 0 && (
					<div className="mx-auto flex h-full  w-full items-center justify-center gap-5 md:max-w-[90rem]">
						<UserVideoPanel />
						{/* <span className="absolute bottom-3 left-4 z-40 rounded-lg text-xs font-semibold text-white sm:text-base">
							{user?.fullName}
						</span> 
					</div>
				)}
				{streams.length === 1 && (
					<div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-5 md:max-w-[90rem] md:flex-row">
						{streams.map((stream, index) => (
							<RemoteUserVideoPanel key={index} stream={stream} />
						))}
						<div className="absolute bottom-[12vh] right-8 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
							<UserVideoPanel />
						</div>
					</div>
				)}
				{streams.length > 1 && (
					<div className="flex h-full w-full flex-col items-center justify-center gap-5 md:flex-row">
						{streams.map((stream, index) => (
							<div key={index} className="w-full">
								<RemoteUserVideoPanel stream={stream} />
							</div>
						))}
						{/* =<RemoteUserVideoPanel stream={localStream!} /> 
						<UserVideoPanel />

						<div className="absolute bottom-[12vh] right-8 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
							<UserVideoPanel />
						</div> 
					</div>
				)} */}
			</div>

			<ControlPanel roomId={roomId} />
		</main>
	);
};

export default MeetingRoom;
