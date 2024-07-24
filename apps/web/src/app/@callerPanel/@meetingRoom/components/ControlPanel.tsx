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
import { useSocket } from '@/context/SocketContext';
import { useWebRTC } from '@/context/WebRTCContext';
import useRoomStore from '@/store/useRoomStore';
import useStreamStore from '@/store/useStreamStore';
import { useAuth } from '@clerk/nextjs';

import {
	Mic,
	Phone,
	Video,
	MicOff,
	VideoOff,
	SlidersVertical,
	Clock,
	Users,
	Volume2,
	Info,
} from 'lucide-react';
import React, { useCallback } from 'react';

export interface Device {
	deviceId: string;
	label: string;
	groupId: string;
}

const ControlPanel = ({ roomId }: { roomId: string }) => {
	const toggleCamera = useStreamStore((state) => state.toggleCamera);
	const toggleMicrophone = useStreamStore((state) => state.toggleMicrophone);
	const isCameraOn = useStreamStore((state) => state.isCameraOn);
	const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	// const toggleScreenShare = useStreamStore((state) => state.toggleScreenShare);
	// const isScreenSharing = useStreamStore((state) => state.isScreenSharing);
	// const mediaDevices = useStreamStore((state) => state.mediaDevices);
	// const selectedCamera = useRoomStore((state) => state.selectedCamera);
	// const selectedMicrophone = useRoomStore((state) => state.selectedMicrophone);
	// const setSelectedCamera = useStreamStore((state) => state.setSelectedCamera);
	// const setSelectedMicrophone = useStreamStore(
	// 	(state) => state.setSelectedMicrophone
	// );
	const setRoomState = useRoomStore((state) => state.setRoomState);

	const { socketEmit } = useSocket();
	const { userId } = useAuth();
	const { disconnectPeer } = useWebRTC();
	// const router = useRouter();

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

	const handleCallEnd = useCallback(() => {
		socketEmit('event:callEnd', {
			roomId,
			userId,
		});
		disconnectPeer();
		setRoomState('outSideLobby');
	}, [disconnectPeer, roomId, setRoomState, socketEmit, userId]);

	return (
		<div className="bottom-0 left-0 z-50 grid h-16 w-full grid-cols-1 rounded-b-lg border border-t border-gray-200 bg-white px-8 dark:border-gray-600 dark:bg-gray-700 md:grid-cols-3">
			<div className="me-auto hidden items-center justify-center gap-3 text-gray-500 dark:text-gray-400 md:flex">
				<Clock className="h-4 w-4" />
				<span className="text-sm">12:43 PM</span>
			</div>
			<div className="mx-auto flex items-center justify-center">
				<Button
					variant={isCameraOn ? 'default' : 'destructive'}
					onClick={() => toggleCamera()}
					data-tooltip-target="tooltip-microphone"
					type="button"
					className="group me-4 rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
				>
					{isCameraOn ? (
						<Video className="h-7 w-7" />
					) : (
						<VideoOff className="h-7 w-7" />
					)}
					<span className="sr-only">Mute microphone</span>
				</Button>

				<div
					id="tooltip-microphone"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Mute microphone
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>

				<Button
					data-tooltip-target="tooltip-camera"
					variant={isMicrophoneOn ? 'default' : 'destructive'}
					onClick={() => toggleMicrophone()}
					type="button"
					className="group me-4 rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
				>
					{isMicrophoneOn ? (
						<Mic className="h-6 w-7" />
					) : (
						<MicOff className="h-7 w-7" />
					)}
					<span className="sr-only">Hide camera</span>
				</Button>

				<div
					id="tooltip-camera"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Hide camera
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>

				<Button
					data-tooltip-target="tooltip-settings"
					type="button"
					className="group me-4 rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
				>
					<SlidersVertical className="h-7 w-7" />
					<span className="sr-only">Video settings</span>
				</Button>
				<div
					id="tooltip-settings"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Video settings
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger
					// className={`${isCameraOn ? 'bg-primary' : 'bg-destructive'} rounded-r-md p-2`}
					>
						<Button className="group rounded-full bg-gray-100 p-2.5 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800 md:hidden">
							<svg
								className="h-4 w-4 text-gray-500 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 4 15"
							>
								<path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
							</svg>
							<span className="sr-only">Show options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Cameras</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuItem>Show participants</DropdownMenuItem>
						<DropdownMenuItem>Adjust volume</DropdownMenuItem>
						<DropdownMenuItem>Show information</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* <button
					id="moreOptionsDropdownButton"
					data-dropdown-toggle="moreOptionsDropdown"
					type="button"
					className="group rounded-full bg-gray-100 p-2.5 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800 md:hidden"
				>
					<svg
						className="h-4 w-4 text-gray-500 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 4 15"
					>
						<path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
					</svg>
					<span className="sr-only">Show options</span>
				</button>
				<div
					id="moreOptionsDropdown"
					className="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
				>
					<ul
						className="py-2 text-sm text-gray-700 dark:text-gray-200"
						aria-labelledby="moreOptionsDropdownButton"
					>
						<li>
							<a
								href="#"
								className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
							>
								Show participants
							</a>
						</li>
						<li>
							<a
								href="#"
								className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
							>
								Adjust volume
							</a>
						</li>
						<li>
							<a
								href="#"
								className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
							>
								Show information
							</a>
						</li>
					</ul>
				</div> */}
				<Button
					variant={'destructive'}
					onClick={() => handleCallEnd()}
					data-tooltip-target="tooltip-microphone"
					type="button"
					className="group me-4 rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
				>
					<Phone className="h-6 w-7" />
					<span className="sr-only">Mute microphone</span>
				</Button>

				<div
					id="tooltip-microphone"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Call Disconnect
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
			</div>
			<div className="ms-auto hidden items-center justify-center md:flex">
				<Button
					data-tooltip-target="tooltip-participants"
					type="button"
					className="group me-1 rounded-full p-2.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
				>
					<Users className="h-4 w-4" />
					<span className="sr-only">Show participants</span>
				</Button>
				<div
					id="tooltip-participants"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Show participants
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<Button
					data-tooltip-target="tooltip-volume"
					type="button"
					variant={'ghost'}
					className="group me-1 rounded-full p-2.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
				>
					<Volume2 className="h-4 w-4" />
					<span className="sr-only">Adjust volume</span>
				</Button>
				<div
					id="tooltip-volume"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Adjust volume
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<Button
					data-tooltip-target="tooltip-information"
					type="button"
					variant={'ghost'}
					className="group rounded-full p-2.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
				>
					<Info className="h-3 w-3" />
					<span className="sr-only">Show information</span>
				</Button>
				<div
					id="tooltip-information"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Show information
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
			</div>
		</div>
		// <div className="flex h-[9vh] w-full items-center justify-center border border-white bg-background">
		// 	<div className="flex gap-4">
		// 		{/* Camera */}
		// 		<div className="flex">
		// 			<Button
		// 				variant={isCameraOn ? 'default' : 'destructive'}
		// 				onClick={() => toggleCamera()}
		// 				className="rounded-r-none p-3"
		// 			>
		// 				{isCameraOn ? (
		// 					<Video className="h-7 w-7" />
		// 				) : (
		// 					<VideoOff className="h-7 w-7" />
		// 				)}
		// 			</Button>
		// 			<DropdownMenu>
		// 				<DropdownMenuTrigger
		// 					className={`${isCameraOn ? 'bg-primary' : 'bg-destructive'} rounded-r-md p-2`}
		// 				>
		// 					<ChevronDown className="h-4 w-4 text-background" />
		// 				</DropdownMenuTrigger>
		// 				<DropdownMenuContent>
		// 					<DropdownMenuLabel>Cameras</DropdownMenuLabel>
		// 					<DropdownMenuSeparator />
		// 					{mediaDevices.cameras.map((camera) => (
		// 						<DropdownMenuItem
		// 							key={camera.deviceId}
		// 							onClick={() => setSelectedCamera(camera.deviceId)}
		// 						>
		// 							{camera.label || `Camera ${camera.deviceId}`}
		// 						</DropdownMenuItem>
		// 					))}
		// 				</DropdownMenuContent>
		// 			</DropdownMenu>
		// 		</div>

		// 		{/* Microphone */}
		// 		<div className="flex">
		// 			<Button
		// 				variant={isMicrophoneOn ? 'default' : 'destructive'}
		// 				onClick={() => toggleMicrophone()}
		// 				className="rounded-r-none p-3"
		// 			>
		// 				{isMicrophoneOn ? (
		// 					<Mic className="h-6 w-7" />
		// 				) : (
		// 					<MicOff className="h-7 w-7" />
		// 				)}
		// 			</Button>
		// 			<DropdownMenu>
		// 				<DropdownMenuTrigger
		// 					className={`${isMicrophoneOn ? 'bg-primary' : 'bg-destructive'} rounded-r-md p-2`}
		// 				>
		// 					<ChevronDown className="h-4 w-4 text-background" />
		// 				</DropdownMenuTrigger>
		// 				<DropdownMenuContent>
		// 					<DropdownMenuLabel>Microphone</DropdownMenuLabel>
		// 					<DropdownMenuSeparator />
		// 					{mediaDevices.microphones.map((microphone) => (
		// 						<DropdownMenuItem
		// 							key={microphone.deviceId}
		// 							onClick={() => setSelectedMicrophone(microphone.deviceId)}
		// 						>
		// 							{microphone.label || `Microphone ${microphone.deviceId}`}
		// 						</DropdownMenuItem>
		// 					))}
		// 				</DropdownMenuContent>
		// 			</DropdownMenu>
		// 		</div>

		// 		<Button
		// 			onClick={() => toggleScreenShare()}
		// 			variant={isScreenSharing ? 'destructive' : 'default'}
		// 		>
		// 			{isScreenSharing ? (
		// 				<ScreenShareOff className="h-6 w-7" />
		// 			) : (
		// 				<ScreenShare className="h-6 w-7" />
		// 			)}
		// 		</Button>

		// 		<Button
		// 			variant={'destructive'}
		// 			onClick={() => handleCallEnd()}
		// 			className=""
		// 		>
		// 			<Phone className="h-6 w-7" />
		// 		</Button>
		// 	</div>
		// </div>
	);
};

export default ControlPanel;