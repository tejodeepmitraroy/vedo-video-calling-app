'use client';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSocket } from '@/context/SocketContext';
import { useWebRTC } from '@/context/WebRTCContext';
import useGlobalStore from '@/store/useGlobalStore';
// import useRoomStore from '@/store/useRoomStore';
import useScreenStateStore from '@/store/useScreenStateStore';
import useStreamStore from '@/store/useStreamStore';
import { useAuth } from '@clerk/nextjs';

import { Mic, Phone, Video, MicOff, VideoOff, Users, Info } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

export interface Device {
	deviceId: string;
	label: string;
	groupId: string;
}

const NewControlPanel = ({ roomId }: { roomId: string }) => {
	const toggleCamera = useStreamStore((state) => state.toggleCamera);
	const toggleMicrophone = useStreamStore((state) => state.toggleMicrophone);
	const isCameraOn = useStreamStore((state) => state.isCameraOn);
	const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	const roomDetails = useGlobalStore((state) => state.roomDetails);
	// const setRoomState = useRoomStore((state) => state.setRoomState);

	const { socketEmit } = useSocket();
	const { userId } = useAuth();
	const { disconnectPeer } = useWebRTC();
	// const router = useRouter();

	const setCurrentScreen = useScreenStateStore(
		(state) => state.setCurrentScreen
	);

	// console.log('selected Camera------>', selectedCamera);
	// console.log('selected Microphone------>', selectedMicrophone);

	// console.log(
	// 	'camera--->',
	// 	isCameraOn,
	// 	'Mic--->',
	// 	isMicrophoneOn,
	// 	'Stream-------->',
	// 	isScreenSharing
	// );

	const handleLeaveRoom = useCallback(() => {
		socketEmit('event:callEnd', {
			roomId,
		});

		disconnectPeer();
		// router.push('/');
		// setRoomState('outSideLobby');
		setCurrentScreen('OutSide Lobby');
	}, [disconnectPeer, roomId, setCurrentScreen, socketEmit]);

	const handleEndRoom = useCallback(() => {
		socketEmit('event:endRoom', { roomId });
	}, [roomId, socketEmit]);

	return (
		<div className="absolute bottom-0 left-0 z-50 flex h-16 w-full grid-cols-1 justify-between border-gray-200 px-8 dark:border-gray-600 dark:bg-gray-700 md:grid-cols-3">
			<div className="hidden items-center justify-center gap-3 text-white dark:text-gray-400 md:flex">
				{roomId}
			</div>
			{/* <div className=" mb-4 flex items-center justify-center gap-4 rounded-md bg-white px-4 py-2">
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant={isCameraOn ? 'default' : 'destructive'}
							onClick={() => toggleCamera()}
							data-tooltip-target="tooltip-microphone"
							type="button"
							className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
						>
							{isCameraOn ? (
								<Video className="h-7 w-7" />
							) : (
								<VideoOff className="h-7 w-7" />
							)}
							<span className="sr-only">Mute microphone</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Camera On/Off</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger>
						<Button
							data-tooltip-target="tooltip-camera"
							variant={isMicrophoneOn ? 'default' : 'destructive'}
							onClick={() => toggleMicrophone()}
							type="button"
							className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
						>
							{isMicrophoneOn ? (
								<Mic className="h-6 w-7" />
							) : (
								<MicOff className="h-7 w-7" />
							)}
							<span className="sr-only">Hide camera</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Microphone On/Off</p>
					</TooltipContent>
				</Tooltip>
				{roomDetails?.createdById === userId ? (
					<Tooltip>
						<TooltipTrigger>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant={'destructive'}
										data-tooltip-target="tooltip-microphone"
										type="button"
										className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
									>
										<Phone className="h-6 w-7" />
										<span className="sr-only">Leave</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>As a Host</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => handleLeaveRoom()}>
										Leave Room
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleEndRoom()}>
										End Room
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TooltipTrigger>
						<TooltipContent>
							<p>Leave Room</p>
						</TooltipContent>
					</Tooltip>
				) : (
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant={'destructive'}
								data-tooltip-target="tooltip-microphone"
								type="button"
								onClick={() => handleLeaveRoom()}
								className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
							>
								<Phone className="h-6 w-7" />
								<span className="sr-only">Leave</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Leave Room</p>
						</TooltipContent>
					</Tooltip>
				)}
				<div
					id="tooltip-microphone"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Call Disconnect
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
			</div> */}
			<div className="mx-auto mb-4 flex h-fit items-center justify-center gap-4 rounded-md bg-white px-4 py-2">
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant={isCameraOn ? 'default' : 'destructive'}
							onClick={() => toggleCamera()}
							data-tooltip-target="tooltip-microphone"
							type="button"
							className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
						>
							{isCameraOn ? (
								<Video className="h-7 w-7" />
							) : (
								<VideoOff className="h-7 w-7" />
							)}
							<span className="sr-only">Mute microphone</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Camera On/Off</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger>
						<Button
							data-tooltip-target="tooltip-camera"
							variant={isMicrophoneOn ? 'default' : 'destructive'}
							onClick={() => toggleMicrophone()}
							type="button"
							className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
						>
							{isMicrophoneOn ? (
								<Mic className="h-6 w-7" />
							) : (
								<MicOff className="h-7 w-7" />
							)}
							<span className="sr-only">Hide camera</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Microphone On/Off</p>
					</TooltipContent>
				</Tooltip>
				{roomDetails?.createdById === userId ? (
					<Tooltip>
						<TooltipTrigger>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant={'destructive'}
										data-tooltip-target="tooltip-microphone"
										type="button"
										className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
									>
										<Phone className="h-6 w-7" />
										<span className="sr-only">Leave</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>As a Host</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => handleLeaveRoom()}>
										Leave Room
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleEndRoom()}>
										End Room
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TooltipTrigger>
						<TooltipContent>
							<p>Leave Room</p>
						</TooltipContent>
					</Tooltip>
				) : (
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant={'destructive'}
								data-tooltip-target="tooltip-microphone"
								type="button"
								onClick={() => handleLeaveRoom()}
								className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
							>
								<Phone className="h-6 w-7" />
								<span className="sr-only">Leave</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Leave Room</p>
						</TooltipContent>
					</Tooltip>
				)}
				<div
					id="tooltip-microphone"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Call Disconnect
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
			</div>
			<div className="mb-4 flex h-fit items-center justify-center gap-4 rounded-md bg-white px-4 py-2">
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant={'outline'}
							onClick={() => toggleCamera()}
							className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
						>
							<Users className="h-4 w-4" />
							<span className="sr-only">Show participants</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Show participants</p>
					</TooltipContent>
				</Tooltip>
				{/* <Tooltip>
					<TooltipTrigger>
						<Button
							variant={'outline'}
							onClick={() => toggleCamera()}
							className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
						>
							<Volume2 className="h-4 w-4" />
							<span className="sr-only">Adjust volume</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Adjust volume</p>
					</TooltipContent>
				</Tooltip> */}
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant={'outline'}
							onClick={() => toggleCamera()}
							className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
						>
							<Info className="h-4 w-4" />
							<span className="sr-only">Show information</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Show information</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export default NewControlPanel;
