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

import useGlobalStore from '@/store/useGlobalStore';

import useStreamStore from '@/store/useStreamStore';
import { useAuth } from '@clerk/nextjs';

import {
	Mic,
	Phone,
	Video,
	MicOff,
	VideoOff,
	EllipsisVertical,
	Share2,
} from 'lucide-react';
import React, { useCallback } from 'react';
import { RWebShare } from 'react-web-share';

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

	const { socketEmit } = useSocket();
	const { userId } = useAuth();
	// const { disconnectPeer } = useWebRTC();

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
	}, [roomId, socketEmit]);

	const handleEndRoom = useCallback(() => {
		socketEmit('event:endRoom', { roomId });
	}, [roomId, socketEmit]);

	return (
		<div className="absolute bottom-0 left-0 z-50 flex h-16 w-full grid-cols-1 justify-between border-gray-200 px-8 dark:border-gray-600 dark:bg-gray-700 md:grid-cols-3">
			<div className="hidden items-center justify-center gap-3 text-white dark:text-gray-400 md:flex">
				{roomId}
			</div>

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

				<Tooltip>
					<TooltipTrigger>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									data-tooltip-target="tooltip-microphone"
									type="button"
									className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
								>
									<EllipsisVertical className="h-6 w-7" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>Options</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<RWebShare
									data={{
										text: 'Share',
										url: window.location.href,
										title: 'roomUrl',
									}}
									onClick={() => console.log('roomUrl shared successfully!')}
								>
									<DropdownMenuItem className="w-full gap-1.5 text-sm">
										<Share2 className="size-3.5" />
										Share
									</DropdownMenuItem>
								</RWebShare>
							</DropdownMenuContent>
						</DropdownMenu>
					</TooltipTrigger>
					<TooltipContent>
						<p>Options</p>
					</TooltipContent>
				</Tooltip>
			</div>
			{/* <div className="mb-4 flex h-fit items-center justify-center gap-4 rounded-md bg-white px-4 py-2">
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
				</Tooltip> 
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
			</div> */}
		</div>
	);
};

export default NewControlPanel;
